import React from 'react';
import logo from './img/logo.jpg';
import copyright from './img/copyright.jpg';
import paypal from './img/paypal.png';
import visa from './img/visa.png';
import mastercard from './img/mastercard.png';

const FooterTur = () => {
  return (
    <footer className="bg-white shadow-md py-8">
      <div className="container mx-auto flex flex-col-reverse md:flex-row justify-between items-start space-y-8 md:space-y-0">
        <div className="w-full md:w-3/8 md:mb-0 text-gray-700 text-left ml-10">
          <div className="md:mt-0 mt-6">
            <p className="mb-3 md:mb-6 text-xs text-blueth">Merkez Bankası Lisansı</p>
            <p className="mb-3 md:mb-6 text-xs text-blueth">Teklif Sözleşmesi</p>
            <p className="mb-6 text-xs text-blueth">Kullanım Şartları</p>
          </div>
          <p className="mb-3 md:mb-6 text-xs w-[350px]"> İsviçre, Zugerbergstrasse 41B, 6300 Zug</p>
          <div className="flex flex-col items-start">
            <img src={logo} alt="Paylink Logo" className="h-[32px] mb-2" />
            <div className='flex flex-row items-center my-1'>
              <p className='text-xs font-thin'>Telif Hakkı</p>
              <img src={copyright} alt="Paylink Telif Hakkı" className="h-3 w-3 mx-1" />
              <p className='mr-1 font-bold text-purple-950'> Paylink</p>
              <p className='mx-1 font-thin text-xs'>2024</p>
            </div>
          </div>
        </div>
        
        <div className="w-full flex flex-col md:w-3/8 md:ml-0 ml-2 px-8">
          <p className="mb-6 text-xs text-grayth">
              Genel Bankacılık İşlemleri Lisansı No. 1481, 11.08.2015.
            </p>
            <p className="mb-6 text-xs text-grayth">
              Paylink'in Interfax ajansındaki bilgi açıklama sayfası
            </p>
            <p className="mb-6 text-xs text-grayth">
              Profesyonel menkul kıymetler piyasası katılımcısı olarak bilgi açıklaması
            </p>
            <p className="mb-6 text-xs text-grayth">
              Bireylerle yapılan banka mevduat anlaşmalarında faiz oranları hakkında bilgi
            </p>
            <p className="mb-3 md:mb-4 text-xs text-grayth">
              Bilgilendirme kaynağı önerilen teknolojileri kullanır
            </p>
        </div>
        <div className="w-full md:w-2/8 mb-6 mt-6 md:mb-0 ml-2 px-8">
          <p className="mb-6 text-xs font-bold">Hakkımızda</p>
          <p className="mb-6 text-xs font-bold">Hizmetler</p>
          <p className="mb-6 text-xs font-bold">İletişim</p>
          <p className="mb-6 text-xs font-bold">Destek</p>
          <p className="text-xs font-bold">Veri Koruma</p>
        </div>
        <div className="w-full md:w-1/4 mb-6 md:mb-0 flex justify-end md:justify-start px-4">
          <div className="absolute flex-col items-center space-y-8 md:mt-0 mt-6">
          <img src={paypal} alt="PayPal" className="h-4 w-4" />
            <img src={visa} alt="Visa" className="pl-1 w-8" />
            <img src={mastercard} alt="MasterCard" className="w-8" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterTur;
