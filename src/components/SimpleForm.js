import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CardImage from './img/card.png';
import FastsystemImage from './img/spb.png';
import TerminalImage from './img/terminaleng.png';
import './styles.css';

const SimpleForm = () => {
  const [formData, setFormData] = useState({
    selectedCard: '',
    amount: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCardSelect = (card) => {
    setFormData({
      ...formData,
      selectedCard: card
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    switch (formData.selectedCard) {
      case 'card1':
        navigate('/orderspb', { state: { ...formData, fromSimpleForm: true } });
        break;
      case 'card2':
        navigate('/order', { state: { ...formData, fromSimpleForm: true } });
        break;
      case 'card3':
        navigate('/orderother', { state: { ...formData, fromSimpleForm: true } });
        break;
      default:
        break;
    }
  };

  const getCardImage = () => {
    switch (formData.selectedCard) {
      case 'card1':
        return FastsystemImage;
      case 'card2':
        return CardImage;
      case 'card3':
        return TerminalImage;
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-fon px-4">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-12 text-center">Оберіть опцію та вкажіть скільки грошей мяу</h2>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          <div
            className={`bg-white p-8 rounded-lg ${formData.selectedCard === 'card1' ? 'shadow-md bg-grayth' : ''} border-0 cursor-pointer transition transform ${formData.selectedCard === 'card1' ? '' : 'shadow-2xl'} hover:scale-105`}
            onClick={() => handleCardSelect('card1')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70%' }}
          >
            <div className="flex justify-center items-center h-60 w-60 mb-10">
              <img src={FastsystemImage} alt="Card 1" className="h-48 w-48 object-contain" />
            </div>
            <p className="text-center mb-16 px-6">Система быстрых платежей – это сервис платежной системы Банка России</p>
            <button
              className={`py-2 px-4 mb-10 rounded-md w-36 h-14 text-white font-bold  ${formData.selectedCard === 'card1' ? 'text-purpleth' : 'text-purpleth hover:bg-purple-950 hover:text-white'}`}
            >
              СБП
            </button>
          </div>
          <div
            className={`bg-white p-8 rounded-lg ${formData.selectedCard === 'card2' ? 'shadow-md bg-grayth' : ''} border-0 cursor-pointer transition transform ${formData.selectedCard === 'card2' ? '' : 'shadow-2xl'} hover:scale-105`}
            onClick={() => handleCardSelect('card2')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70%' }}
          >
            <div className="flex justify-center items-center h-60 w-60 mb-10">
              <img src={CardImage} alt="Card 2" className="h-41 w-56 object-contain" />
            </div>
            <p className="text-center mb-16 px-6">Технология перевода денежных средств онлайн напрямую через продавца</p>
            <button
              className={`py-2 px-4 mb-10 rounded-md w-36 h-14 text-white font-bold ${formData.selectedCard === 'card2' ? 'text-purpleth' : 'text-purpleth hover:bg-purple-950 hover:text-white'}`}
            >
              Карта банка
            </button>
          </div>
          <div
            className={`bg-white p-8 rounded-lg ${formData.selectedCard === 'card3' ? 'shadow-md bg-grayth' : ''} border-0 cursor-pointer transition transform ${formData.selectedCard === 'card3' ? '' : 'shadow-2xl'} hover:scale-105`}
            onClick={() => handleCardSelect('card3')}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70%' }}
          >
            <div className="flex justify-center items-center h-60 w-60 mb-10">
              <img src={TerminalImage} alt="Card 3" className="h-50 w-50 object-contain" />
            </div>
            <p className="text-center mb-16 px-6">Обрабатывает платежи по кредитным или дебетовым картам от имени продавца</p>
            <button
              className={`py-2 px-4 mb-10 rounded-md w-36 h-14 text-white font-bold  ${formData.selectedCard === 'card3' ? 'text-purpleth' : 'text-purpleth hover:bg-purple-950 hover:text-white'}`}
            >
              Эквайринг
            </button>
          </div>
        </div>
        <div className="flex justify-center bg-white m-16">
          <form onSubmit={handleSubmit} className="w-full max-w-md  p-6 rounded-lg ">
            <div className="mb-8">
              <label htmlFor="amount" className="block text-sm font-normal text-gray-700">
                Сумма сделки в рублях
              </label>
              <input
                type="number"
                name="amount"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
                className="mt-1 block w-full max-w-md border bg-gray-form border-gray-200 rounded-md shadow-sm p-2 hover:shadow-md focus:bg-white focus:border-neutral-700 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-grayth h-[50px] mt-4 font-bold text-white py-2 px-4 rounded-lg hover:bg-purple-950 w-full mb-12"
              disabled={!formData.selectedCard}
            >
              Далее
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SimpleForm;
