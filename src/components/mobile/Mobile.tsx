import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import './mobile_style.css';
import '../styles.css';

import { checkOperator } from '../mobile/MobileBase.tsx';

interface FormInput {
  mobilenum: string;
}

const error: SubmitErrorHandler<FormInput> = data => {
  console.log('err', data);
};

const MobileInfo: React.FC = () => {
  const navigate = useNavigate();
  const [mobileResult, setMobileResult] = useState<string>('');
  const [clientMobile, setClientMobile] = useState<string>('');

  const submitMobileCheck = () => {
    const mobilenum = localStorage.getItem('mobilenum');
    const parsedData = mobilenum ? JSON.parse(mobilenum) : {};
    const phoneNumber: string = parsedData.mobilenum || '';

    if (phoneNumber) {
      setClientMobile(phoneNumber);
      setMobileResult(checkOperator(phoneNumber));
    } else {
      setClientMobile(phoneNumber);
      setMobileResult('Номер не действителен');
    }
  };

  const submit: SubmitHandler<FormInput> = data => {
    localStorage.setItem('mobilenum', JSON.stringify(data));
    submitMobileCheck();
    document.querySelector('.get-in-touch')?.classList.add('hidden');
    document.querySelector('.get-in-result')?.classList.remove('hidden');
    document.querySelector('.cat_container')?.classList.add('hidden');
  };

  const { register, handleSubmit, formState: { errors } } = useForm<FormInput>();

  const clickCat = () => {
    document.querySelector('.cat_container')?.classList.add('hidden');
    document.querySelector('.get-in-touch')?.classList.remove('hidden');
    document.querySelector('.get-in-result')?.classList.add('hidden');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-fon p-4">
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 text-center text-grayth">КП Сервис</h1>
          <p className="text-center text-grayth">Тыкни в кота</p>
        </div>

        <div className="relative flex flex-col items-center">
          <div onClick={clickCat} className="cat_container cursor-pointer">
            <div className="cat">
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
                                            <div className="mustache_cont">
                                                <div className="mustache"></div>
                                                <div className="mustache"></div>
                                            </div>
                                            <div className="nose"></div>
                                            <div className="eye"></div>
                                            <div className="eye"></div>
                                            <div className="brow_cont">
                                                <div className="brow"></div>
                                                <div className="brow"></div>
                                            </div>
                                            <div className="brow_cont">
                                                <div className="brow"></div>
                                                <div className="brow"></div>
                                            </div>
                                            <div className="ear_l">
                                                <div className="inner"></div>
                                            </div>
                                            <div className="ear_r">
                                                <div className="outer"></div>
                                                <div className="inner"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </div>
          </div>

          <div className="get-in-result hidden text-center">
            <p className="text-lg font-bold text-blueth">+7{clientMobile}</p>
            <h1 className="text-2xl font-bold text-blueth">{mobileResult}</h1>
          </div>

          <div className="get-in-touch hidden">
            <form className="w-full max-w-md mx-auto p-4 rounded-lg bg-white shadow-lg" onSubmit={handleSubmit(submit, error)}>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-normal text-gray-700">Номер телефона</label>
                <input
                  id="phone"
                  className="block w-full border bg-gray-form border-gray-200 rounded-md shadow-sm p-2 hover:shadow-md focus:bg-white focus:border-neutral-700 focus:outline-none"
                  type="text"
                  {...register('mobilenum', {
                    required: 'Номер телефона обязателен',
                    validate: value => (/^\d+$/.test(value) && value.startsWith('9') && value.length === 10) || 'Напишите свой номер телефона начиная с цифры 9 (без +7)',
                  })}
                  aria-invalid={errors.mobilenum ? 'true' : 'false'}
                />
                {errors.mobilenum && <p className="text-red-500 text-sm mt-2">{errors.mobilenum.message}</p>}
              </div>

              <button type="submit" className="w-full py-2 px-4 bg-grayth text-white font-bold rounded-lg hover:bg-purple-950">
                Отправить
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-8">
          <h2 className="text-lg font-bold text-grayth">База данных не имеет следующие префиксы:</h2>
          <p className="text-sm text-grayth mt-4">
            908 930 931 932 933 934 938 939 950 953 958 967 968 969 977 978 991 992 993 994 995 996 997
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileInfo;
