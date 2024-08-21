import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { checkTradeStatus } from '../utils/api';
import logo from './img/logo.jpg';
import successIcon from './img/succes.png';
import failIcon from './img/fail.png';
import stillIcon from './img/still.png';
import telegram from './img/telegram.png';
import print from './img/print.png';
import download from './img/download.png';
import './styles.css';

const Status = () => {
  const location = useLocation();
  const { order, userId } = location.state || {};
  
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({});
  const [historyData, setHistoryData] = useState({});
  const [operationId, setOperationId] = useState(() => {
    const savedOperationId = localStorage.getItem('operationId') || generateRandomId() ;
    return  savedOperationId;
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem('timeLeft');
    return savedTime ? parseInt(savedTime, 10) : 30 * 60;
  });

  const generateRandomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 3; i++) {
      result += `${characters.charAt(Math.floor(Math.random() * characters.length))}${characters.charAt(Math.floor(Math.random() * characters.length))}${characters.charAt(Math.floor(Math.random() * characters.length))}${characters.charAt(Math.floor(Math.random() * characters.length))}`;
      if (i < 2) result += '-';
    }
    return result;
  };

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`/api/db/form/${location.state.id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching form data:', error);
        setError('Error fetching form data');
      }
    };

    if (location.state && location.state.id) {
      fetchFormData();
    }
  }, [location.state]);

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        const response = await axios.get(`/api/db/history/${userId}`);
        setHistoryData(response.data);
      } catch (error) {
        setError('Error fetching history data');
      }
    };

    if (userId) {
      fetchHistoryData();
    }
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await checkTradeStatus(order);
        if (data && data.length > 0) {
          const obj = data[0];
          setResult(obj.result);
          setMessage(obj.message);
          localStorage.setItem('Resultation', obj.result);
          localStorage.setItem('ResultMessage', obj.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const intervalId = setInterval(() => {
      fetchData();
    }, 15000); // 15 секунд

    fetchData();

    return () => clearInterval(intervalId);
  }, [order]);

  useEffect(() => {
    console.log('location.state:', location.state); // Вывод в консоль для проверки
  }, [location.state]);

  useEffect(() => {
    if (!localStorage.getItem('operationId')) {
      localStorage.setItem('operationId', operationId);
    }
  }, [operationId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime > 0 ? prevTime - 1 : 0;
        localStorage.setItem('timeLeft', newTime);
        return newTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const gradientTimer = setInterval(() => {
      const circle = document.querySelector('.circle');
      if (circle) {
        circle.classList.remove('animate-gradient');
        void circle.offsetWidth; 
        circle.classList.add('animate-gradient');
      }
    }, 2000);
    return () => clearInterval(gradientTimer);
  }, []);

  const formatTime = time => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const renderStatusText = () => {
    if (message === 'still processing') {
      return <p className="text-sm font-bold ml-4 text-blueth">...</p>;
    } else if (message === 'fully paid') {
      return  <p className="text-sm font-bold ml-4 text-blueth">Успешно</p>;    
    } else {
        return  <p className="text-sm font-bold ml-4 text-red-400">Не подтвержден</p>;    
    }
  };

  const renderStatusIcon = () => {
    if (message === 'still processing') {
      return <img src={stillIcon} alt="Still Processing" width="24" height="24" />;
    } else if (message === 'fully paid') {
      return <img src={successIcon} alt="Success" width="24" height="24" />;
    } else {
      return <img src={failIcon} alt="Fail" width="24" height="24" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-gray-fon">
      <div className="flex flex-col items-center justify-between space-y-4 h-full w-full max-w-3xl">
        <div className="w-full bg-white p-8 rounded-lg md:mb-16 mb-0 mt-8">
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600 mb-4">Ожидание подтверждения</p>
            <div className="relative flex justify-center items-center">
              <svg className="w-24 h-24" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="static-gradient" x1="0%" y1="0%" x2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgba(6, 155, 231, 1)', stopOpacity: 1 }} />
                    <stop offset="70%" style={{ stopColor: 'rgba(48, 12, 96, 0.8)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'rgba(6, 155, 231, 1)', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="animated-gradient" x1="0%" y1="0%" x2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgba(6, 155, 231, 1)', stopOpacity: 0.4 }} />
                    <stop offset="50%" style={{ stopColor: 'rgba(48, 12, 96, 1)', stopOpacity: 0.4 }} />
                    <stop offset="100%" style={{ stopColor: 'rgba(48, 12, 96, 1)', stopOpacity: 0.4 }} />
                  </linearGradient>
                </defs>
                <circle
                  className="static-circle"
                  r="45"
                  cx="50"
                  cy="50"
                  stroke="url(#static-gradient)"
                  strokeWidth="4"
                  fill="transparent"
                />
                <circle
                  className="circle animated-circle"
                  stroke="url(#animated-gradient)"
                  strokeWidth="4"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                  style={{ strokeDasharray: '170 283', strokeDashoffset: '0' }}
                />
              </svg>
              <p className="absolute text-2xl font-bold text-blueth">{formatTime(timeLeft)}</p>
            </div>
          </div>
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Paylink Logo" className="w-[150px] h-[60px]" />
          </div>
          <h2 className="text-center text-lg font-medium mb-8">Детали операции</h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right">
                <p className="text-sm text-grayth mr-4">Заявка №</p>
              </div>
              <div className="w-1/2 text-left">
                <p className="text-sm font-bold ml-4">{ order || 'Ошибка'}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right">
                <p className="text-sm text-grayth mr-4">Сумма транзакции</p>
              </div>
              <div className="w-1/2 text-left">
                <p className="text-sm font-bold ml-4">{historyData.amount || 'Ошибка'}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right">
                <p className="text-sm text-grayth mr-4">Имя Фамилия отправителя</p>
              </div>
              <div className="w-1/2 text-left">
                <p className="text-sm font-bold ml-4">{formData.name }</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right">
                <p className="text-sm text-grayth mr-4">Номер телефона отправителя</p>
              </div>
              <div className="w-1/2 text-left">
                <p className="text-sm font-bold ml-4">{formData.phoneNumber }</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right">
                <p className="text-sm text-grayth mr-4">Банк-исполнитель</p>
              </div>
              <div className="w-1/2 text-left">
                <p className="text-sm font-bold ml-4">{historyData.cardNumber || 'Ошибка'}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right">
                <p className="text-sm text-grayth mr-4">Идентификатор операции</p>
              </div>
              <div className="w-1/2 text-left">
                <p className="text-sm font-bold ml-4">{operationId}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right">
                <p className="text-sm text-grayth mr-4">Статус</p>
              </div>
              <div className="w-1/2 text-left">
                {renderStatusText()}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right"></div>
              <div className="w-1/2 text-left ml-8">
                {renderStatusIcon()}
              </div>
            </div>
          </div>
        </div>
        <div className="flex md:flex-row flex-col space-y-8 md:space-x-4 pb-8">
          <button className="bg-purple-950 text-white py-2 md:mt-8 mt-0 md:px-4 px-6 rounded-lg flex justify-between items-center hover:bg-purple-700 md:w-[186px] w-[230px] h-[50px]">
            <span className="m-2">Отправить</span>
            <img src={telegram} alt="Отправить" className="w-5 h-5" />
          </button>
          <button className="bg-purple-950 text-white py-2 md:px-4 px-6 rounded-lg flex justify-between items-center hover:bg-purple-700 md:w-[186px] w-[230px] h-[50px]">
            <span className="m-2">Распечатать</span>
            <img src={print} alt="Распечатать" className="w-5 h-5" />
          </button>
          <button className="bg-purple-950 text-white py-2 md:px-4 px-6 rounded-lg flex justify-between items-center hover:bg-purple-700 md:w-[186px] w-[230px] h-[50px]">
            <span className="m-2">Скачать PDF</span>
            <img src={download} alt="Скачать PDF" className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center mt-4 md:w-[470px] w-[300px]">
          <p className="text-sm text-gray-500">
            В случае ошибки или неправильного ввода информации, а так же при статусе 'Закрыта' в случае если Вы осуществили перевод{' '}
            <a href="#" className="text-blueth">
              обратитесь в службу поддержки
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-4">Все данные защищены</p>
        </div>
      </div>
    </div>
  );
};

export default Status;
