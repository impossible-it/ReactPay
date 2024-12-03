import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import './mobile_style.css';
import '../styles.css';
import catWait from '../img/catwait.png'; // Импорт изображения
import catReload from '../img/catreload.png'; // Импорт изображения
import catInput from '../img/catinput.png'; // Импорт изображения

import catPhone from '../img/phone.png'; // Импорт изображения телефона
import { checkOperator, countryCodes } from '../mobile/MobileBase.tsx'; // Импорт метода для проверки оператора

interface FormInput {
  mobilenum: string;
}

const MobileInfo: React.FC = () => {
  const [showCat, setShowCat] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [showInputCat, setShowInputCat] = useState(false);

  const [showPhone, setShowPhone] = useState(false);
  const [operator, setOperator] = useState<string>(''); // Состояние для хранения оператора

  const { register, handleSubmit, formState: { errors } } = useForm<FormInput>();

  const handleClickCat = () => {
    setShowCat(false);
    setShowInput(true);
  };

  const handleReturnToCat = () => {
    setShowPhone(false);
    setShowInput(true);
    setShowInputCat(true);
    setShowCat(false);
  };

  const submit: SubmitHandler<FormInput> = data => {
    console.log('Form submitted:', data);
    const rawNumber = data.mobilenum.replace('+7', ''); // Удаляем "+7" если есть
    const detectedOperator = checkOperator(rawNumber); // Передаём очищенный номер
    setOperator(detectedOperator); // Сохраняем оператора в состояние
    setShowInput(false);
    setShowPhone(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-fon p-4">
      <div className="container mx-auto p-4">
        <div className="relative flex flex-col items-center">
          {showCat && (
            <div
              onClick={handleClickCat}
              className="cat_container cursor-pointer"
              role="button"
              aria-label="Click to show input"
            >
              <p className='font-bold text-center'>Кот в ожидании.. Нажми на кота для старта</p>
              <img src={catWait} alt="Cat waiting" className="cat_image" />
            </div>
          )}

          {showInput && (
            <div className="get-in-touch">
               {showInputCat && ( 
                <div className="phone_image_container justify-center items-center text-center">
                <img src={catInput} alt="Cat on phone" className=" phone_image mb-4" />
                </div>
               )}
              <form
                className="w-full max-w-md mx-auto p-4 rounded-lg bg-white shadow-lg"
                onSubmit={handleSubmit(submit)}
              >
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-normal text-gray-700 mb-1">
                    Номер телефона для проверки
                  </label>
                  <input
                    id="phone"
                    className="block w-full h-10 border bg-gray-form border-gray-200 rounded-md shadow-sm p-2 hover:shadow-md focus:bg-white focus:border-neutral-700 focus:outline-none"
                    type="text"
                    {...register('mobilenum', {
                      required: 'Номер телефона обязателен',
                      validate: value => {
                        const rawNumber = value.replace(/\s|-/g, ''); // Удаляем пробелы и дефисы
                        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 формат

                        // Проверка для международных номеров
                        if (!phoneRegex.test(rawNumber)) {
                          return 'Введите корректный номер телефона';
                        }

                        // Проверка для российских номеров
                        if (rawNumber.startsWith('+7') || rawNumber.startsWith('9')) {
                          const localNumber = rawNumber.replace('+7', '').replace('9', '');
                          // Убираем строгую проверку на 10 цифр
                        }

                        // Проверка для номеров других стран
                        const country = countryCodes.find(c => rawNumber.startsWith(c.code));
                        if (country) {
                          const numberWithoutCode = rawNumber.replace(country.code, '');
                          if (numberWithoutCode.length < 5 || numberWithoutCode.length > 15) { 
                            // Длина номера в международном формате может варьироваться
                            return `Некорректная длина номера для страны ${country.countryName}`;
                          }
                        }

                        return true;
                      },
                    })}
                    aria-invalid={errors.mobilenum ? 'true' : 'false'}
                  />
                  {errors.mobilenum && (
                    <p className="text-red-500 text-sm mt-2">{errors.mobilenum.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-grayth text-white font-bold rounded-lg hover:bg-purple-950"
                >
                  Кот проверь
                </button>
              </form>
            </div>
          )}

          {showPhone && (
            <div className="phone_image_container justify-center items-center text-center">
              <h2 className="text-lg font-bold text-greyth mb-4">Котик проверил! Результат ниже:</h2>
              <div className='flex justify-center flex-col items-center'>
                <img src={catPhone} alt="Cat on phone" className=" phone_image mb-4" />
              </div>

              <h2 className="text-lg font-bold text-blueth mb-4">{operator}</h2> {/* Отображаем оператора */}
              <div className='flex justify-center flex-col items-center'>
                <img onClick={handleReturnToCat} src={catReload} alt="Cat waiting" className="cat_image w-20 h-15"  />
                Перезагрузить
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileInfo;
