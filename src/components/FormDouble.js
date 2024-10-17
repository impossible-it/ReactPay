import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import LogotypeTextImage from './img/LogotypeText.png';
import TerminalSecImage from './img/terminal2.png';
import CardImage from './img/card.png';
import FastsystemImage from './img/spb.png';

import './styles.css';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    amount: '',
    clientNumber: '',
    cardChoice: '',
    agreement: false,
  });

  const [touchedFields, setTouchedFields] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.selectedCard) {
      setFormData({ ...formData, cardChoice: location.state.selectedCard });
    }
  }, [location.state]);

  const validateName = (name) => {
    const regex = /^[А-Яа-я]+\s[А-Яа-я]+$/;
    return regex.test(name.trim());
  };

  const validatePhoneNumber = (phoneNumber) => {
    return /^\+79\d{9}$/.test(phoneNumber);
  };

  const validateAmount = (amount) => {
    return amount >= 500 && amount <= 100000;
  };

  const validateClientNumber = (clientNumber) => {
    return clientNumber === '' || (clientNumber.length >= 3 && clientNumber.length <= 6);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedValue = type === 'checkbox' ? checked : value;
    let newErrors = { ...errors };

    if (name === 'name' && !validateName(updatedValue)) {
      newErrors.name = 'Имя и фамилия должны быть на русском и с большой буквы';
    } else if (name === 'phoneNumber') {
      if (updatedValue.startsWith('9')) {
        updatedValue = `+79${updatedValue.slice(1)}`;
      } else if (updatedValue.startsWith('7')) {
        updatedValue = `+7${updatedValue.slice(1)}`;
      } else if (!updatedValue.startsWith('+7')) {
        newErrors.phoneNumber = 'Номер телефона должен быть в формате +7XXXXXXXXXX';
      } else {
        delete newErrors.phoneNumber;
      }
      if (!validatePhoneNumber(updatedValue)) {
        newErrors.phoneNumber = 'Номер телефона должен быть в формате +7XXXXXXXXXX';
      } else {
        delete newErrors.phoneNumber;
      }
    } else if (name === 'amount' && !validateAmount(updatedValue)) {
      newErrors.amount = 'Сумма должна быть в пределах от 500 до 100000 рублей';
    } else if (name === 'clientNumber' && !validateClientNumber(updatedValue)) {
      newErrors.clientNumber = 'Промокод должен содержать от 3 до 6 цифр';
    } else {
      delete newErrors[name];
    }

    setErrors(newErrors);
    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouchedFields({ ...touchedFields, [name]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post('http://localhost:3000/api/form', formData);
        const { cardChoice } = formData;
        if (cardChoice === 'card1') {
          navigate('/orderspbdm', { state: { id: response.data._id } });
        } else if (cardChoice === 'card2') {
          navigate('/orderdm', { state: { id: response.data._id } });
        } else if (cardChoice === 'card3') {
          navigate('/orderother', { state: { id: response.data._id } });
        }
      } catch (error) {
        console.error('Error submitting form:', error.message);
      }
    } else {
      setTouchedFields({
        name: true,
        phoneNumber: true,
        amount: true,
        clientNumber: true,
      });
    }
  };

  const getCardImage = () => {
    switch (formData.cardChoice) {
      case 'card1':
        return FastsystemImage;
      case 'card2':
        return CardImage;
      case 'card3':
        return TerminalSecImage;
      default:
        return '';
    }
  };

  const getImageStyle = () => {
    if (formData.cardChoice === 'card2') {
      return { width: '150px', height: '140px' };
    }
    return { width: '150px', height: '70px' };
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-fon px-4">
      <div className="relative bg-white rounded-lg w-full max-w-xl p-4 sm:p-8 md:p-12" style={{ maxWidth: '608px', height: '817px' }}>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img src={getCardImage()} alt="Terminal" className="h-auto w-auto" style={getImageStyle()} />
        </div>
        <div className="pt-16 pb-6">
          <form onSubmit={handleSubmit} className="flex flex-col items-center text-grayth">
            <div className="mb-6 w-full flex flex-col items-center">
              <label htmlFor="name" className="block mr-5 font-normal text-gray-700 w-full max-w-md text-left">
                Имя Фамилия
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full max-w-md border ${touchedFields.name || formData.name ? 'bg-white border-neutral-700' : 'bg-gray-form border-gray-200'} rounded-md shadow-sm p-2 hover:shadow-md focus:bg-white focus:border-neutral-700 focus:outline-none`}
                required
                style={{ maxWidth: '470px', height: '35px' }}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div className="mb-6 w-full flex flex-col items-center">
              <label htmlFor="phoneNumber" className="block mr-5 font-normal text-gray-700 w-full max-w-md text-left">
                Номер телефона
              </label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full max-w-md border ${touchedFields.phoneNumber || formData.phoneNumber ? 'bg-white border-neutral-700' : 'bg-gray-form border-gray-200'} rounded-md shadow-sm p-2 hover:shadow-md focus:bg-white focus:border-neutral-700 focus:outline-none`}
                pattern="\+79\d{9}"
                title="Номер телефона должен быть в формате +7XXXXXXXXXX"
                required
                style={{ maxWidth: '470px', height: '35px' }}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
            </div>
            <div className="mb-6 w-full flex flex-col items-center">
              <label htmlFor="amount" className="block mr-5 font-normal text-gray-700 w-full max-w-md text-left">
                Сумма сделки в рублях
              </label>
              <input
                type="number"
                name="amount"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full max-w-md border ${touchedFields.amount || formData.amount ? 'bg-white border-neutral-700' : 'bg-gray-form border-gray-200'} rounded-md shadow-sm p-2 hover:shadow-md focus:bg-white focus:border-neutral-700 focus:outline-none`}
                required
                style={{ maxWidth: '470px', height: '35px' }}
              />
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
            </div>
            <div className="mb-12 w-full flex flex-col items-center">
              <label htmlFor="clientNumber" className="block mr-5 font-normal text-gray-700 w-full max-w-md text-left">
                Промокод (необязательно)
              </label>
              <input
                type="number"
                name="clientNumber"
                id="clientNumber"
                value={formData.clientNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full max-w-md border ${touchedFields.clientNumber || formData.clientNumber ? 'bg-white border-neutral-700' : 'bg-gray-form border-gray-200'} rounded-md shadow-sm p-2 hover:shadow-md focus:bg-white focus:border-neutral-700 focus:outline-none`}
                max="999999"
                style={{ maxWidth: '470px', height: '35px' }}
              />
              {errors.clientNumber && <p className="text-red-500 text-sm">{errors.clientNumber}</p>}
            </div>
            <div className="mb-2 w-full flex items-center justify-between" style={{ maxWidth: '470px' }}>
              <label htmlFor="agreement" className="block font-normal text-gray-700">
                Подтверждаете пользовательское соглашение?
              </label>
              <label className="switch">
                <input
                  type="checkbox"
                  name="agreement"
                  id="agreement"
                  checked={formData.agreement}
                  onChange={handleChange}
                  required
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="mb-4 w-full flex text-sm" style={{ maxWidth: '470px' }}>
              <a href="/path-to-user-agreement" className="text-blueth hover:underline">
                Нажмите для просмотра договора аферты...
              </a>
            </div>
            <button
              type="submit"
              className="bg-grayth mt-4 text-white py-2 px-4 rounded-lg hover:bg-purple-950"
              style={{ width: '100%', maxWidth: '470px', height: '50px', fontSize:'16px', fontWeight:'700' }}
            >
              Перейти к следующему шагу
            </button>
          </form>
        </div>

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2 text-center">
          <p className="text-xs text-gray-500 mb-3">
            Добро пожаловать на сервис платежей в интернете "Пейлинк"! Заполните Ваши персональные данные и объем желаемых вложений. Все права защищены!
          </p>
          <img src={LogotypeTextImage} alt="Paylink" className="mx-auto mb-6" style={{ width: '122px', height: '46px' }} />
        </div>
      </div>
    </div>
  );
};

export default Form;