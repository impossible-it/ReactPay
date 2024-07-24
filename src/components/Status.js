import React, { useState, useEffect } from 'react';
import { checkTradeStatus } from '../utils/api';
import logo from './img/logo.jpg';
import './styles.css';

const Status = ({ order }) => {
  const [loadingProp, setLoadingProp] = useState(0);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingProp(1);
        const data = await checkTradeStatus(order);
        if (data && data.length > 0) {
          const obj = data[0];
          setResult(obj.result);
          setMessage(obj.message);
          localStorage.setItem('Resultation', obj.result);
          localStorage.setItem('ResultMessage', obj.message);
          switch (obj.message) {
            case 'still processing':
              setLoadingProp(77);
              setTimeout(() => window.location.reload(), 20000);
              break;
            case 'fully paid':
              setLoadingProp(100);
              break;
            case 'trade archived':
              setLoadingProp(0);
              setTimeout(() => window.location.reload(), 60000);
              break;
            default:
              break;
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoadingProp(0);
        setTimeout(() => window.location.reload(), 5000);
      }
    };
    fetchData();
  }, [order]);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-fon">
      <div className="flex flex-col items-center space-y-4" style={{ maxWidth: '630px', width: '100%' }}>
        <div className="bg-white p-4 rounded-lg relative">
          <div className="flex justify-between items-center">
            <div className="">
              <h2 className="text-base font-normal">Номер заявки</h2>
              <p className="text-sm mt-2 text-blueth">{order || 'Ошибка получения номера заявки'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg relative">
          <div className="flex justify-between items-center">
            <div className="">
              <h2 className="text-base font-normal">Статус</h2>
              <p className="text-sm mt-2 text-blueth">{message || 'Ошибка получения статуса'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg relative">
          <div className="flex justify-between items-center">
            <div className="">
              <h2 className="text-base font-normal">Результат</h2>
              <p className="text-sm mt-2 text-blueth">{result || 'Ошибка получения результата'}</p>
            </div>
          </div>
        </div>
        <div className="w-full bg-white p-4 mt-4 rounded-lg">
          <div className="text-gray-700 p-4">
            <div className='flex align-center items-center mb-6'>
              <img src={logo} alt="Paylink Logo" className="absolute w-[25px] h-[25px]" />
              <h2 className="text-lg font-md ml-8">Детали операции</h2>
            </div>
            <ul className="space-y-2">
              <li className="bg-gray-form rounded-xl content-center mx-auto p-2" style={{ width: '95%', fontSize: '14px' }}>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold ml-2">Ожидание подтверждения</p>
                  <div className='flex justify-center w-[50px] h-[35px] items-center'>
                    <button className="font-medium text-3xl mb-2">{loadingProp}%</button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex space-x-4">
          <button className="bg-purple-950 text-white py-2 px-4 rounded-lg hover:bg-purple-700">Отправить</button>
          <button className="bg-purple-950 text-white py-2 px-4 rounded-lg hover:bg-purple-700">Распечатать</button>
          <button className="bg-purple-950 text-white py-2 px-4 rounded-lg hover:bg-purple-700">Скачать PDF</button>
        </div>
        <div className="text-center mt-4" style={{ maxWidth: '470px', width: '470px' }}>
          <p className="text-sm text-gray-500">
            В случае ошибки или неправильного ввода информации, а так же при НЕ ПОДТВЕРЖДЕННОМ статусе <a href="#" className="text-blueth">обратитесь в службу поддержки</a>. Все данные защищены.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Status;
