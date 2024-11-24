import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CardImage from './img/card.png';
import FastsystemImage from './img/spb.png';
import TerminalImage from './img/terminaleng.png';
import './styles.css';

const SimpleForm = () => {
  const [formData, setFormData] = useState({
    selectedCard: 'card2', // Default selection
    amount: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('return', 1); // Storing in localStorage
  }, []);

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-fon px-2">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-12 text-center">Выберите опцию и укажите сумму</h2>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
          {[{ img: FastsystemImage, text: 'По номеру телефона', card: 'card1' },
            { img: CardImage, text: 'Карта банка', card: 'card2' },
            { img: TerminalImage, text: 'Эквайринг', card: 'card3' }].map((item, index) => (
            <div
              key={index}
              className={`bg-white p-8 rounded-lg ${formData.selectedCard === item.card ? 'shadow-md bg-grayth' : ''} md:flex md:flex-col border-0 md:w-[100%] w-[70%] cursor-pointer transition transform ${formData.selectedCard === item.card ? 'hover:shadow-2xl' : 'hover:shadow-lg'} hover:scale-105`}
              onClick={() => handleCardSelect(item.card)}
              style={{ flexDirection: 'column', alignItems: 'center', display: 'flex' }}
            >
              <div className="flex justify-center items-center md:h-60 h-20 w-25 md:w-60 mb-0 md:mb-10">
                <img src={item.img} alt={`Card ${index + 1}`} className="h-25 md:h-41 w-25 md:w-56 object-contain" />
              </div>
              <button
                className={`py-2 px-4 mb-0 md:mb-10 rounded-md w-36 h-14 text-white font-bold ${formData.selectedCard === item.card ? 'text-purpleth' : 'text-purpleth hover:bg-purple-950 hover:text-white'}`}
              >
                {item.text}
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-center bg-white m-16">
          <form onSubmit={handleSubmit} className="w-full max-w-md p-6 rounded-lg">
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
