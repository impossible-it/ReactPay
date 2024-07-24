import React from 'react';
import logo from './img/logo.jpg';
import copyright from './img/copyright.jpg';
import paypal from './img/copyright.jpg';
import visa from './img/copyright.jpg';
import mastercard from './img/copyright.jpg';

const Footer = () => {
  return (
    <footer className="bg-white shadow-md py-8">
      <div className="container mx-auto flex flex-col-reverse  md:flex-row justify-between items-start space-y-8 md:space-y-0">
        <div className="w-full md:w-3/8  md:mb-0 text-gray-700 text-left px-16">
          <div className="">
            <p className="mb-3 md:mb-6 text-xs text-blueth">Лицензия Центрального Банка</p>
            <p className="mb-3 md:mb-6 text-xs text-blueth">Договор оферты</p>
            <p className="mb-3 md:mb-6 text-xs text-blueth">Условия пользования</p>
          </div>
          <p className="mb-3 md:mb-6 text-xs">Россия, 117648, г. Москва, мкр. Чертаново Северное, д. 1А, корп.1</p>
          <div className="flex flex-col items-start">
            <img src={logo} alt="Paylink Logo" className="h-[32px] mb-3" />
            <div className='flex flex-row items-center  my-1'>
              <p className='text-xs font-thin'>Copyright</p>
              <img src={copyright} alt="Paylink Copyright" className=" h-3 w-3 mx-1" />
              <p className='mr-1 font-bold text-purple-950'> Paylink</p>
              <p className='mx-1 font-thin text-xs'>2024</p>
            </div>
          </div>
        </div>
        
        <div className="w-full flex flex-col md:w-3/8  px-8">
          <p className="mb-3 text-xs text-grayth">
              Генеральная лицензия на осуществление банковских операций №1481 от 11.08.2015 г.
            </p>
            <p className="mb-3 text-xs text-grayth">
              Страница Пейлинк в агентстве Интерфакс по раскрытию информации
            </p>
            <p className="mb-3 text-xs text-grayth">
              Раскрытие информации как о профессиональном участнике рынка ценных бумаг
            </p>
            <p className="mb-3 text-xs text-grayth">
              Информация о процентных ставках по договорам банковского вклада с физическими лицами
            </p>
            <p className="mb-3 md:mb-4 text-xs text-grayth">
              На информационном ресурсе применяются рекомендательные технологии
            </p>
        </div>
        <div className="w-full md:w-2/8 mb-6 md:mb-0 ml-8 px-8">
          <p className="mb-6 text-xs font-bold">О нас</p>
          <p className="mb-6 text-xs font-bold">Сервис</p>
          <p className="mb-6 text-xs font-bold">Контакты</p>
          <p className="mb-6 text-xs font-bold">Поддержка</p>
          <p className=" text-xs font-bold">Защита персональных данных</p>
        </div>
        <div className="w-full md:w-1/4 mb-6 md:mb-0 flex justify-end md:justify-start px-4">
          <div className="flex flex-col items-center space-y-4">
            <img src={paypal} alt="PayPal" className="h-8 w-auto" />
            <img src={visa} alt="Visa" className="h-8 w-auto mb-2" />
            <img src={mastercard} alt="Mastercard" className="h-8 w-auto mb-2" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
