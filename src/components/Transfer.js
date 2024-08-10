import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

import CardImage from './img/card.png';
import FastsystemImage from './img/spb.png';
import TerminalImage from './img/terminal.png';

const CardSelection = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();

  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };

  const handleSubmit = () => {
    switch (selectedCard) {
      case 'card1':
      case 'card2':
      case 'card3':
      default:
        navigate('/transfer/createrequest', { state: { selectedCard } });
        break;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-fon px-4">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-8 justify-items-center my-8">
          <div
            className={`flex flex-col items-center w-full lg:w-[90%] md:w-[70%] bg-white p-8 rounded-lg ${selectedCard === 'card1' ? 'shadow-md bg-grayth' : ''} border-0 cursor-pointer transition transform hover:scale-105 ${selectedCard === 'card1' ? 'hover:shadow-2xl' : 'hover:shadow-lg'}`}
            onClick={() => handleCardSelect('card1')}
          >
            <div className="flex justify-center items-center h-48 w-48 md:h-60 md:w-60 mb-6 md:mb-10">
              <img src={FastsystemImage} alt="Card 1" className="h-full w-full object-contain" />
            </div>
            <p className="text-center mb-8 md:mb-16 px-2 md:px-6">Система быстрых платежей – это сервис платежной системы Банка России</p>
            <button
              className={`py-2 px-4 mb-4 md:mb-10 rounded-md w-24 md:w-36 h-12 md:h-14 text-white font-bold ${selectedCard === 'card1' ? 'text-purpleth' : 'text-purpleth hover:bg-purple-950 hover:text-white'}`}
            >
              СБП
            </button>
          </div>
          <div
            className={`flex flex-col items-center w-full lg:w-[90%] md:w-[70%] bg-white p-8 rounded-lg ${selectedCard === 'card2' ? 'shadow-md bg-grayth' : ''} border-0 cursor-pointer transition transform hover:scale-105 ${selectedCard === 'card2' ? 'hover:shadow-2xl' : 'hover:shadow-lg'}`}
            onClick={() => handleCardSelect('card2')}
          >
            <div className="flex justify-center items-center h-48 w-48 md:h-60 md:w-60 mb-6 md:mb-10">
              <img src={CardImage} alt="Card 2" className="h-full w-full object-contain" />
            </div>
            <p className="text-center mb-8 md:mb-16 px-2 md:px-6">Технология перевода денежных средств онлайн напрямую через продавца</p>
            <button
              className={`py-2 px-4 mb-4 md:mb-10 rounded-md w-36 md:w-36 h-12 md:h-14 text-white font-bold ${selectedCard === 'card2' ? 'text-purpleth' : 'text-purpleth hover:bg-purple-950 hover:text-white'}`}
            >
              Карта банка
            </button>
          </div>
          <div
            className={`flex flex-col items-center w-full lg:w-[90%] md:w-[70%] bg-white p-8 rounded-lg ${selectedCard === 'card3' ? 'shadow-md bg-grayth' : ''} border-0 cursor-pointer transition transform hover:scale-105 ${selectedCard === 'card3' ? 'hover:shadow-2xl' : 'hover:shadow-lg'}`}
            onClick={() => handleCardSelect('card3')}
          >
            <div className="flex justify-center items-center h-48 w-48 md:h-60 md:w-60 mb-6 md:mb-10">
              <img src={TerminalImage} alt="Card 3" className="h-full w-full object-contain" />
            </div>
            <p className="text-center mb-8 md:mb-16 px-2 md:px-6">Обрабатывает платежи по кредитным или дебетовым картам от имени продавца</p>
            <button
              className={`py-2 px-4 mb-4 md:mb-10 rounded-md w-24 md:w-36 h-12 md:h-14 text-white font-bold ${selectedCard === 'card3' ? 'text-purpleth' : 'text-purpleth hover:bg-purple-950 hover:text-white'}`}
            >
              Эквайринг
            </button>
          </div>
        </div>
        <div className="flex justify-center my-8 md:my-24">
          <button
            className="bg-gray-400 font-bold text-white py-2 h-[50px] w-[407px] px-10 rounded-md hover:bg-violet-950"
            onClick={handleSubmit}
            disabled={!selectedCard}
          >
            Далее
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardSelection;
