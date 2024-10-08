import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

import TerminalImage from './img/terminaleng.png';

const CardSelectionEng = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();

  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };

  const handleSubmit = () => {
    switch (selectedCard) {
      case 'card2':
      case 'card3':
      default:
        navigate('/transfer/createrequesteng', { state: { selectedCard } });
        break;
    }
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-fon px-4">
      <div className="container mx-auto md:p-4 p-8 md:mt-16 mt-0">
        <div className="grid grid-cols-1  2xl:grid-cols-1 gap-8 justify-items-center my-8">
          {/* <div
            className={`flex flex-col items-center w-full lg:w-[80%] md:w-[70%] bg-white p-8 rounded-lg ${selectedCard === 'card2' ? 'shadow-md bg-grayth' : ''} border-0 cursor-pointer transition transform hover:scale-105 ${selectedCard === 'card2' ? 'hover:shadow-2xl' : 'hover:shadow-lg'}`}
            onClick={() => handleCardSelect('card2')}
          >
            <div className="flex justify-center items-center h-48 w-48 md:h-60 md:w-60 mb-0 md:mb-10">
              <img src={CardImage} alt="Card Payment" className="h-full w-full object-contain" />
            </div>
            <p className="text-center mb-4 md:mb-12 px-2 md:px-6">Online money transfer technology directly through the seller</p>
            <button
              className={`py-2 px-4 mb-4 md:mb-10 rounded-md w-36 md:w-36 h-12 md:h-14 text-white font-bold ${selectedCard === 'card2' ? 'text-purpleth' : 'text-purpleth hover:bg-purple-950 hover:text-white'}`}
            >
              Bank Card
            </button>
          </div> */}
          <div
            className={`flex flex-col items-center w-80% md:w-[75%] 2xl:w-[35%] bg-white p-8 rounded-lg ${selectedCard === 'card3' ? 'shadow-md bg-grayth' : ''} border-0 cursor-pointer transition transform hover:scale-105 ${selectedCard === 'card3' ? 'hover:shadow-2xl' : 'hover:shadow-lg'}`}
            onClick={() => handleCardSelect('card3')}
          >
            <div className="flex justify-center items-center h-48 w-48 md:h-60 md:w-60 mb-0 md:mb-10">
              <img src={TerminalImage} alt="Acquiring" className="h-full w-full object-contain" />
            </div>
            <p className="text-center mb-4 md:mb-12 px-2 md:px-6">Processes payments via credit or debit cards on behalf of the seller</p>
            <button
              className={`py-2 px-4 mb-4 md:mb-10 rounded-md w-full md:w-80 h-12 md:h-14 text-white font-bold ${selectedCard === 'card3' ? 'text-purpleth' : 'text-purpleth hover:bg-purple-950 hover:text-white'}`}
            >
              ACT Capital Partners AG 
            </button>
          </div>
        </div>
        <div className="flex justify-center md:mt-24 mt-16 my-8 md:my-24">
          <button
            className="bg-gray-400 font-bold text-white py-2 h-[50px] w-[407px] px-10 rounded-md hover:bg-violet-950"
            onClick={handleSubmit}
            disabled={!selectedCard}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardSelectionEng;
