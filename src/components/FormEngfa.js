import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import LogotypeTextImage from './img/LogotypeText.png';
import TerminalSecImage from './img/telegram.png';
import CardImage from './img/terminaleng.png';
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
    const regex = /^[A-Za-z]+\s[A-Za-z]+$/; // English characters only
    return regex.test(name.trim());
  };

  const validatePhoneNumber = (phoneNumber) => {
    return /^\+\d+$/.test(phoneNumber);
  };

  const validateAmount = (amount) => {
    return amount >= 3000 && amount <= 100000;
  };

  const validateClientNumber = (clientNumber) => {
    return clientNumber === '' || (clientNumber.length >= 3 && clientNumber.length <= 6);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updatedValue = type === 'checkbox' ? checked : value;
    let newErrors = { ...errors };

    if (name === 'name' && !validateName(updatedValue)) {
      newErrors.name = 'First and last name must start with uppercase letters.';
    } else if (name === 'phoneNumber') {
      if (!updatedValue.startsWith('+')) {
        updatedValue = `+${updatedValue}`;
      }
      if (!validatePhoneNumber(updatedValue)) {
        newErrors.phoneNumber = 'Phone number must be in the format +XXXXXXXXXXXX.';
      } else {
        delete newErrors.phoneNumber;
      }
    } else if (name === 'amount' && !validateAmount(updatedValue)) {
      newErrors.amount = 'Amount must be between 90 and 100000 EUR';
    } else if (name === 'clientNumber' && !validateClientNumber(updatedValue)) {
      newErrors.clientNumber = 'Promo code must contain between 3 and 6 digits.';
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
        const response = await axios.post('/api/db/form', formData);
        const { cardChoice } = formData;
        
        // Save form ID to localStorage
        localStorage.setItem('formId', response.data._id);
  
        if (cardChoice === 'card1') {
          navigate('/orderspb', { state: { id: response.data._id } });
        } else if (cardChoice === 'card2') {
          navigate('/orderengfa', { state: { id: response.data._id } });
        } else if (cardChoice === 'card3') {
          navigate('/orderothereng', { state: { id: response.data._id } });
        }
      } catch (error) {
        console.error('Form submission error:', error.message);
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
      return { width: '150px', height: '144px' };
    }
    return { width: '150px', height: '70px' };
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-fon px-4">
      <div className="relative bg-white md:mt-0 mt-12 rounded-lg w-full md:max-w-[608px] max-w-[350px] p-4 sm:p-8 md:p-12  md:h-[817px] h-[770px]" >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:mt-0 mt-12">
          <img src={getCardImage()} alt="Terminal" className="h-auto w-auto" style={getImageStyle()} />
        </div>
        <div className="pt-16 pb-6 md:mt-0 mt-10">
          <form onSubmit={handleSubmit} className="flex flex-col items-center text-grayth">
            <div className="mb-6 w-full flex flex-col items-center">
              <label htmlFor="name" className="block mr-5 font-normal text-gray-700 w-full md:max-w-md max-w-[320px] md:ml-0 ml-6 text-left">
                First and Last Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full md:max-w-[470px] max-w-[320px] h-[35px]  border ${touchedFields.name || formData.name ? 'bg-white border-neutral-700' : 'bg-gray-form border-gray-200'} rounded-md shadow-sm p-2 hover:shadow-md focus:bg-white focus:border-neutral-700 focus:outline-none`}
                required
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div className="mb-6 w-full flex flex-col items-center">
              <label htmlFor="phoneNumber" className="block mr-5 font-normal text-gray-700 w-full md:max-w-md max-w-[320px] md:ml-0 ml-6 text-left">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full md:max-w-[470px] max-w-[320px] h-[35px]  border ${touchedFields.phoneNumber || formData.phoneNumber ? 'bg-white border-neutral-700' : 'bg-gray-form border-gray-200'} rounded-md shadow-sm p-2 hover:shadow-md focus:bg-white focus:border-neutral-700 focus:outline-none`}
                required
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
            </div>
            <div className="mb-6 w-full flex flex-col items-center">
              <label htmlFor="amount" className="block mr-5 font-normal text-gray-700 w-full md:max-w-md max-w-[320px] md:ml-0 ml-6 text-left">
                Transaction Amount (EUR)
              </label>
              <input
                type="number"
                name="amount"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-1 block w-full md:max-w-[470px] max-w-[320px] h-[35px]  border ${touchedFields.amount || formData.amount ? 'bg-white border-neutral-700' : 'bg-gray-form border-gray-200'} rounded-md shadow-sm p-2 hover:shadow-md focus:bg-white focus:border-neutral-700 focus:outline-none`}
                placeholder=""
                required
              />
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
            </div>
            
           <div className="mb-2 w-full flex items-center justify-between w-full md:max-w-[470px] max-w-[320px]">
              <label htmlFor="agreement" className="block font-normal text-gray-700 w-[80%]">
                Do you accept the user agreement?
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
            <div className="mb-4 w-full flex text-sm w-full md:max-w-[470px] max-w-[320px]">
              <a href="/path-to-user-agreement" className="text-blueth hover:underline">
                Click here to view the user agreement...
              </a>
            </div>
            <button
              type="submit"
              className="bg-grayth mt-12 w-full md:max-w-[470px] max-w-[320px] h-[50px] font-base font-bold text-white py-2 px-4 rounded-lg hover:bg-purple-950"
            >
              Proceed to the Next Step
            </button>
          </form>
        </div>
    
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 md:mb-4 mb-8 text-center w-[340px]">
          <p className="text-xs text-gray-500 mb-3">
            Welcome to the online payment service "Paylink"! Please fill in your personal details and the desired transaction amount. All rights reserved!
          </p>
          <img src={LogotypeTextImage} alt="Paylink" className="mx-auto mb-6 w-[122px] h-[46px]" />
        </div>
      </div>
    </div>
    
  ); };

  export default Form;