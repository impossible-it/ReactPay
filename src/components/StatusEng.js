import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './img/cardfag.png';
import successIcon from './img/succes.png';
import successBIcon from './img/succesbig.png';
import { useLocation } from 'react-router-dom';

import telegram from './img/telegram.png';
import print from './img/print.png';
import download from './img/download.png';
import './styles.css';

const Status = () => {
  const location = useLocation();
  const [orderNumber, setOrderNumber] = useState('');
  const { firstName, lastName, amount } = location.state || {}; // Получаем переданные данные
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    amount: '',
  });


  console.log('Received state:', location.state);

  const generateRandomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 3; i++) {
      result += `${characters.charAt(Math.floor(Math.random() * characters.length))}${characters.charAt(Math.floor(Math.random() * characters.length))}${characters.charAt(Math.floor(Math.random() * characters.length))}${characters.charAt(Math.floor(Math.random() * characters.length))}`;
      if (i < 2) result += '-';
    }
    return result;
  };
  const generateOrderNumber = () => {
    const characters = '123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Генерация и сохранение номера при монтировании компонента
  useEffect(() => {
    setOrderNumber(generateOrderNumber());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formId = localStorage.getItem('formId'); // Получаем ID формы из localStorage
        if (formId) {
          const response = await axios.get(`/api/db/form/${formId}`);
          setFormData(response.data);
        } else {
          console.error('Form ID not found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-gray-fon">
      <div className="flex flex-col items-center justify-between space-y-4 h-full w-full max-w-3xl">
        <div className="w-full bg-white p-8 rounded-lg md:mb-16 mb-0 mt-8">
          <div className="text-center mb-8">
            <div className="relative flex justify-center items-center mt-4">
              <img src={successBIcon} alt="Success" className="w-12 h-12" />
            </div>
          </div>
          <div className="flex justify-center mb-6 ml-4">
            <img src={logo} alt="Paylink Logo" className="w-[150px] h-[100px]" />
          </div>
          <h2 className="text-center text-lg font-medium mb-8">Transaction Details</h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right">
                <p className="text-sm text-grayth mr-4">Order Number</p>
              </div>
              <div className="w-1/2 text-left">
                <p className="text-sm font-bold ml-4">{ orderNumber || 'Error'}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right">
                <p className="text-sm text-grayth mr-4">Transaction Amount</p>
              </div>
              <div className="w-1/2 text-left">
              <p className="text-sm font-bold ml-4">{`${amount} EUR`}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right">
                <p className="text-sm text-grayth mr-4">Sender's Full Name</p>
              </div>
              <div className="w-1/2 text-left">
              <p className="text-sm font-bold ml-4">{`${firstName } ${lastName || ''}`}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right">
                <p className="text-sm text-grayth mr-4">Sender's Bank information</p>
              </div>
              <div className="w-1/2 text-left">
                <p className="text-sm font-bold ml-4">Hidden </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="w-1/2 text-right">
                    <p className="text-sm text-grayth mr-4">Operation ID</p>
                </div>
                <div className="w-1/2 text-left">
                    <p className="text-sm font-bold ml-4">{generateRandomId()}</p>
                </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right">
                <p className="text-sm text-grayth mr-4">Status</p>
              </div>
              <div className="w-1/2 text-left">
                <p className="text-sm font-bold ml-4 text-blueth">Success</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right"></div>
              <div className="w-1/2 text-left ml-8">
                <img src={successIcon}></img>
              </div>
            </div>
            
          </div>
        </div>
        <div className="flex md:flex-row flex-col space-y-8 md:space-x-4 pb-8">
          <button className="bg-purple-950 text-white py-2 md:mt-8 mt-0 md:px-4 px-6 rounded-lg flex justify-between items-center hover:bg-purple-700 md:w-[186px] w-[230px] h-[50px]">
            <span className="m-2">Share</span>
            <img src={telegram} alt="Print" className="w-5 h-5" />
          </button>
          <button className="bg-purple-950 text-white py-2 md:px-4 px-6 rounded-lg flex justify-between items-center hover:bg-purple-700 md:w-[186px] w-[230px] h-[50px]">
            <span className="m-2">Print</span>
            <img src={print} alt="Share" className="w-5 h-5" />
          </button>
          <button className="bg-purple-950 text-white py-2 md:px-4 px-6 rounded-lg flex justify-between items-center hover:bg-purple-700 md:w-[186px] w-[230px] h-[50px]">
            <span className="m-2">Download PDF</span>
            <img src={download} alt="Download PDF" className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center mt-4 md:w-[470px] w-[300px]">
          <p className="text-sm text-gray-500">
            In case of an error or incorrect information entry, as well as if the status is 'Closed' in case you made a transfer{' '}
            <a href="#" className="text-blueth">
              contact support
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-4">All data is protected</p>
        </div>
      </div>
    </div>
  );
};

export default Status;
