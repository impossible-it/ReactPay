
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RequestUserData = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardBank, setCardBank] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (cardNumber && cardName && cardBank) {
      try {
        await axios.post('/api/db/userData', {
          cardNumber,
          cardName,
          cardBank
        });
        navigate('/orderSPB');
      } catch (error) {
        setError('Verileri kaydederken bir hata oluştu.');
      }
    } else {
      setError('Lütfen tüm alanları doldurun.');
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-fon min-h-screen">
      <div className="flex flex-col items-center space-y-4 h-full w-full md:max-w-[1070px] max-w-[390px]" >
        <div className="bg-white p-4 rounded-lg w-full md:w-[630px]">
          <h2 className="text-base font-normal">Kullanıcı Verilerini Girin</h2>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Kart Numarası</label>
            <input 
              type="text" 
              value={cardNumber} 
              onChange={(e) => setCardNumber(e.target.value)} 
              className="mt-1 p-2 border rounded w-full" 
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
            <input 
              type="text" 
              value={cardName} 
              onChange={(e) => setCardName(e.target.value)} 
              className="mt-1 p-2 border rounded w-full" 
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Hizmet Veren Banka</label>
            <input 
              type="text" 
              value={cardBank} 
              onChange={(e) => setCardBank(e.target.value)} 
              className="mt-1 p-2 border rounded w-full" 
            />
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          <button 
            className="bg-grayth text-white py-2 px-4 rounded-lg hover:bg-purple-950 mt-4 w-full"
            onClick={handleSave}
          >
            Verileri Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestUserData;
