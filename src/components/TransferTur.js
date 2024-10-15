import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

import TerminalImage from './img/terminaleng.png';

const CardSelectionTurkish = () => {
  // Устанавливаем 'card2' как выбранную по умолчанию
  const [selectedCard, setSelectedCard] = useState('card2');
  const navigate = useNavigate();

  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };

  const handleSubmit = () => {
    switch (selectedCard) {
      case 'card2':
      case 'card3':
      default:
        navigate('/transfer/createrequesttur', { state: { selectedCard } });
        break;
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-fon px-4">
      <div className="container mx-auto md:p-4 p-8 md:mt-16 mt-0">
        <div className="grid grid-cols-1 2xl:grid-cols-1 gap-8 justify-items-center my-8">
          <div
            className={`flex flex-col items-center w-80% md:w-[75%] 2xl:w-[35%] bg-white p-8 rounded-lg ${selectedCard === 'card2' ? 'shadow-md bg-grayth' : ''} border-0 cursor-pointer transition transform hover:scale-105 ${selectedCard === 'card3' ? 'hover:shadow-2xl' : 'hover:shadow-lg'}`}
            onClick={() => handleCardSelect('card2')}
          >
            <div className="flex justify-center items-center h-48 w-48 md:h-60 md:w-60 mb-0 md:mb-10">
              <img src={TerminalImage} alt="Acquiring" className="h-full w-full object-contain" />
            </div>
            <p className="text-center mb-4 md:mb-12 px-2 md:px-6">Satıcı adına kredi veya banka kartlarıyla ödeme işlemlerini gerçekleştirir</p>
            <button
              className={`py-2 px-4 mb-4 md:mb-10 rounded-md w-full md:w-80 h-12 md:h-14 text-white font-bold ${selectedCard === 'card2' ? 'text-purpleth' : 'text-purpleth hover:bg-purple-950 hover:text-white'}`}
            >
              PaylinkGroup
            </button>
          </div>
        </div>
        <div className="flex justify-center md:mt-24 mt-16 my-8 md:my-24">
          <button
            className="bg-gray-400 font-bold text-white py-2 h-[50px] w-[407px] px-10 rounded-md hover:bg-violet-950"
            onClick={handleSubmit}
            // Кнопка не будет заблокирована, так как карточка выбрана по умолчанию
            disabled={!selectedCard}
          >
            İleri
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardSelectionTurkish;
