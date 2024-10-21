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
  const { order } = location.state || {};
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
                <p className="text-sm text-gray-600 mb-4">Ожидание подтверждения</p>
                <div className="relative flex justify-center items-center">
                  <svg className="w-24 h-24" viewBox="0 0 100 100">
                    {/* SVG content */}
                  </svg>
                  <p className="absolute text-2xl font-bold text-blueth">{formatTime(timeLeft)}</p>
                </div>
              </div>
              <div className="flex justify-center mb-6">
                <img src={logo} alt="Paylink Logo" className="w-[150px] h-[60px]" />
              </div>
              {/* Render formData details */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="w-1/2 text-right">
                    <p className="text-sm text-grayth mr-4">Имя Фамилия отправителя</p>
                  </div>
                  <div className="w-1/2 text-left">
                    <p className="text-sm font-bold ml-4">{formData.name}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-1/2 text-right">
                    <p className="text-sm text-grayth mr-4">Номер телефона отправителя</p>
                  </div>
                  <div className="w-1/2 text-left">
                    <p className="text-sm font-bold ml-4">{formData.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        
      </div>
    </div>
  );
};

export default Status;
