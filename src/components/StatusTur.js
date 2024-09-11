import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import axios from 'axios';
import logo from './img/act.png';
import successIcon from './img/succes.png';
import successBIcon from './img/succesbig.png';

import telegram from './img/telegram.png';
import print from './img/print.png';
import download from './img/download.png';
import './styles.css';

const StatusTur = ({ formDataFromOrder }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    amount: '',
  });
  const location = useLocation();
  const generateRandomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 3; i++) {
      result += `${characters.charAt(Math.floor(Math.random() * characters.length))}${characters.charAt(Math.floor(Math.random() * characters.length))}${characters.charAt(Math.floor(Math.random() * characters.length))}${characters.charAt(Math.floor(Math.random() * characters.length))}`;
      if (i < 2) result += '-';
    }
    return result;
  };

  useEffect(() => {
    if (formDataFromOrder) {
      setFormData(formDataFromOrder);
    }
  }, [formDataFromOrder]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-gray-fon">
      <div className="flex flex-col items-center justify-between space-y-4 h-full w-full max-w-3xl">
        <div className="w-full bg-white p-8 rounded-lg md:mb-16 mb-0 mt-8">
          <div className="text-center mb-8">
            <div className="relative flex justify-center items-center mt-4">
              <img src={successBIcon} alt="Başarılı" className="w-12 h-12" />
            </div>
          </div>
          <div className="flex justify-center mb-6 ml-24">
            <img src={logo} alt="Paylink Logo" className="w-[200px] h-[80px]" />
          </div>
          <h2 className="text-center text-lg font-medium mb-8">İşlem Detayları</h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right">
                <p className="text-sm text-grayth mr-4">Sipariş Numarası</p>
              </div>
              <div className="w-1/2 text-left">
                <p className="text-sm font-bold ml-4">{ location.state.trade || 'Hata'}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right">
                <p className="text-sm text-grayth mr-4">İşlem Tutarı</p>
              </div>
              <div className="w-1/2 text-left">
                <p className="text-sm font-bold ml-4">{`${formData.amount} EUR` || 'Hata'}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right">
                <p className="text-sm text-grayth mr-4">Gönderenin Adı</p>
              </div>
              <div className="w-1/2 text-left">
                <p className="text-sm font-bold ml-4">{formData.name || 'Hata'}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right">
                <p className="text-sm text-grayth mr-4">Gönderenin Telefon Numarası</p>
              </div>
              <div className="w-1/2 text-left">
                <p className="text-sm font-bold ml-4">{formData.phoneNumber || 'Hata'}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right">
                <p className="text-sm text-grayth mr-4">İşlem ID</p>
              </div>
              <div className="w-1/2 text-left">
                <p className="text-sm font-bold ml-4">{generateRandomId()}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right">
                <p className="text-sm text-grayth mr-4">Durum</p>
              </div>
              <div className="w-1/2 text-left">
                <p className="text-sm font-bold ml-4 text-blueth">Başarılı</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="w-1/2 text-right"></div>
              <div className="w-1/2 text-left ml-8">
                <img src={successIcon}></img>
              </div>
            </div>
          </div>
        </div>
        <div className="flex md:flex-row flex-col space-y-8 md:space-x-4 pb-8">
          <button className="bg-purple-950 text-white py-2 md:mt-8 mt-0 md:px-4 px-6 rounded-lg flex justify-between items-center hover:bg-purple-700 md:w-[186px] w-[230px] h-[50px]">
            <span className="m-2">Paylaş</span>
            <img src={telegram} alt="Paylaş" className="w-5 h-5" />
          </button>
          <button className="bg-purple-950 text-white py-2 md:px-4 px-6 rounded-lg flex justify-between items-center hover:bg-purple-700 md:w-[186px] w-[230px] h-[50px]">
            <span className="m-2">Yazdır</span>
            <img src={print} alt="Yazdır" className="w-5 h-5" />
          </button>
          <button className="bg-purple-950 text-white py-2 md:px-4 px-6 rounded-lg flex justify-between items-center hover:bg-purple-700 md:w-[186px] w-[230px] h-[50px]">
            <span className="m-2">PDF İndir</span>
            <img src={download} alt="PDF İndir" className="w-5 h-5" />
          </button>
        </div>
        <div className="text-center mt-4 md:w-[470px] w-[300px]">
          <p className="text-sm text-gray-500">
            Bir hata veya yanlış bilgi girme durumu varsa, ayrıca bir transfer yaptıysanız ve durum 'Kapalı' olarak görünüyorsa,{' '}
            <a href="#" className="text-blueth">
              destek ile iletişime geçin
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-4">Tüm veriler korunmaktadır</p>
        </div>
      </div>
    </div>
  );
};

export default StatusTur;
