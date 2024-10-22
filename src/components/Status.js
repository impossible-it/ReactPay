import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import successIcon from './img/success.png';
import failIcon from './img/fail.png';
import stillIcon from './img/still.png';
import logo from './img/logo.jpg';
import telegram from './img/telegram.png';
import print from './img/print.png';
import download from './img/download.png';
import { checkTradeStatus } from '../utils/api'; // Importing the checkTradeStatus function
import './styles.css';

const Status = () => {
  const location = useLocation();
  const { order, amount, cardNumber } = location.state || {};
  const [formData, setFormData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const formId = localStorage.getItem('formId');

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem('timeLeft');
    return savedTime ? parseInt(savedTime, 10) : 30 * 60;
  });

  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Fetch the order status periodically
  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (order) {
        try {
          const data = await checkTradeStatus(order);
          if (data && data.length > 0) {
            setResult(data[0].result);
            setMessage(data[0].message);
          }
        } catch (error) {
          console.error('Error fetching trade status:', error);
          setError('Error fetching trade status');
        }
      }
    };

    const intervalId = setInterval(() => {
      fetchOrderStatus();
    }, 15000); // Poll every 15 seconds

    // Fetch order status on component mount
    fetchOrderStatus();

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [order]);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        if (formId) {
          const response = await axios.get(`/api/db/form/${formId}`);
          console.log('Form data:', response.data); // Logging for debugging
          setFormData(response.data);
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
        setError('Error fetching form data');
      }
    };

    fetchFormData();
  }, [formId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime > 0 ? prevTime - 1 : 0;
        localStorage.setItem('timeLeft', newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Render the status text and icon based on the current message
  const renderStatusText = () => {
    if (message === 'still processing') {
      return 'Ожидание подтверждения...';
    } else if (message === 'fully paid') {
      return 'Успешно';
    } else {
      return 'Не подтвержден';
    }
  };

  const renderStatusIcon = () => {
    if (message === 'still processing') {
      return <img src={stillIcon} alt="Still Processing" />;
    } else if (message === 'fully paid') {
      return <img src={successIcon} alt="Success" />;
    } else {
      return <img src={failIcon} alt="Fail" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-gray-fon">
      <div className="flex flex-col items-center justify-between space-y-4 h-full w-full max-w-3xl">
        
          <>
            <div className="w-full bg-white p-8 rounded-lg md:mb-16 mb-0 mt-8">
              <div className="text-center mb-8">
                <p className="text-sm text-gray-600 mb-4">Идет проверка платежа</p>
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
                    <p className="text-sm font-bold ml-4">{ order || 'Загрузка...'}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-1/2 text-right">
                    <p className="text-sm text-grayth mr-4">Сумма транзакции</p>
                  </div>
                  <div className="w-1/2 text-left">
                    <p className="text-sm font-bold ml-4">{amount || 'Загрузка...'} </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-1/2 text-right">
                    <p className="text-sm text-grayth mr-4">Имя Фамилия отправителя</p>
                  </div>
                  <div className="w-1/2 text-left">
                    <p className="text-sm font-bold ml-4">{formData?.name}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-1/2 text-right">
                    <p className="text-sm text-grayth mr-4">Номер телефона отправителя</p>
                  </div>
                  <div className="w-1/2 text-left">
                    <p className="text-sm font-bold ml-4">{formData?.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-1/2 text-right">
                    <p className="text-sm text-grayth mr-4">Банк-исполнитель</p>
                  </div>
                  <div className="w-1/2 text-left">
                    <p className="text-sm font-bold ml-4">{cardNumber || 'Загрузка...'}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-1/2 text-right">
                    <p className="text-sm text-grayth mr-4">Идентификатор операции</p>
                  </div>
                  <div className="w-1/2 text-left">
                    <p className="text-sm font-bold ml-4">{order}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-1/2 text-right">
                    <p className="text-sm text-grayth mr-4">Статус</p>
                  </div>
                  <div className="w-1/2 font-bold mt-6 md:mt-0 ml-4 md:ml-6 text-left">
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
          </>
        
      </div>
    </div>
  );
};

export default Status;
