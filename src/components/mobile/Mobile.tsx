import React, { useState } from 'react';
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import phoneImage from '../img/phone.png'; // Убедитесь, что путь к изображению верен
import './mobile_style.css';
import '../styles.css';

import { checkOperator } from './MobileBase.tsx';

interface FormInput {
  mobilenum: string;
}

const MobileInfo: React.FC = () => {
  const [mobileResult, setMobileResult] = useState<string>('');
  const [clientMobile, setClientMobile] = useState<string>('');
  const [showCat, setShowCat] = useState<boolean>(true);
  const [showInput, setShowInput] = useState<boolean>(false);
  const [showPhoneImage, setShowPhoneImage] = useState<boolean>(false);

  const submitMobileCheck = () => {
    const mobilenum = localStorage.getItem('mobilenum');
    const parsedData = mobilenum ? JSON.parse(mobilenum) : {};
    const phoneNumber: string = parsedData.mobilenum || '';

    console.log('Phone number:', phoneNumber);

    if (phoneNumber) {
      setClientMobile(phoneNumber);
      setMobileResult(checkOperator(phoneNumber));
      setShowInput(false);
      setShowPhoneImage(false);
      setShowCat(true);
    } else {
      setClientMobile(phoneNumber);
      setMobileResult('Номер не действителен');
    }
  };

  const submit: SubmitHandler<FormInput> = data => {
    console.log('Form submitted:', data);
    localStorage.setItem('mobilenum', JSON.stringify(data));
    submitMobileCheck();
  };

  const error: SubmitErrorHandler<FormInput> = data => {
    console.error('Form error:', data);
  };

  const { register, handleSubmit, formState: { errors } } = useForm<FormInput>();

  const handleClickCat = () => {
    console.log('Cat clicked');
    setShowCat(false);
    setShowPhoneImage(true);
    setShowInput(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-fon p-4">
      <div className="container mx-auto p-4">
        <div className="relative flex flex-col items-center">
          {showCat && (
            <div onClick={handleClickCat} className="cat_container cursor-pointer">
              <div className="cat">
                <div className="paw"></div>
                <div className="paw"></div>
                <div className="shake">
                  <div className="tail"></div>
                  <div className="main">
                    <div className="head"></div>
                    <div className="body">
                      <div className="leg"></div>
                    </div>
                    <div className="face">
                      <div className="mustache_cont">
                        <div className="mustache"></div>
                        <div className="mustache"></div>
                      </div>
                      <div className="nose"></div>
                      <div className="eye"></div>
                      <div className="eye"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showPhoneImage && (
            <img src={phoneImage} alt="Телефон" className="w-24 h-24 mb-4" />
          )}

          {showInput && (
            <form
              className="w-full max-w-md mx-auto p-4 rounded-lg bg-white shadow-lg"
              onSubmit={handleSubmit(submit, error)}
            >
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-normal text-gray-700 mb-1">
                  Номер телефона
                </label>
                <input
                  id="phone"
                  className="block w-full h-10 border bg-gray-form border-gray-200 rounded-md shadow-sm p-2 hover:shadow-md focus:bg-white focus:border-neutral-700 focus:outline-none"
                  type="text"
                  {...register('mobilenum', {
                    required: 'Номер телефона обязателен',
                    validate: value =>
                      (/^\d+$/.test(value) && value.startsWith('9') && value.length === 10) ||
                      'Напишите свой номер телефона начиная с цифры 9 (без +7)',
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
                Отправить
              </button>
            </form>
          )}

          {mobileResult && (
            <div className="text-center mt-4">
              <p className="text-lg font-bold text-blueth">+7{clientMobile}</p>
              <h1 className="text-2xl font-bold text-blueth">{mobileResult}</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileInfo;
