import React from 'react';
import logo from './img/logo.jpg';
import copyright from './img/copyright.jpg';
import paypal from './img/paypal.png';
import visa from './img/visa.png';
import mastercard from './img/mastercard.png';

const FooterEng = () => {
  return (
    <footer className="bg-white shadow-md py-8">
  
      <div className="container mx-auto flex flex-col-reverse md:flex-row justify-between items-start space-y-8 md:space-y-0">
        <div className="md:w-100 w-full md:w-3/8 md:mb-0 text-gray-700 text-left px-8">
          <div className="md:mt-0 mt-6">
            <p className="mb-3 md:mb-6 text-xs text-blueth">Central Bank License</p>
            <p className="mb-3 md:mb-6 text-xs text-blueth">Offer Agreement</p>
            <p className="mb-6 text-xs text-blueth">Terms of Use</p>
          </div>
          <p className="mb-3 md:mb-6 text-xs w-[70%]">Switzerland, Zugerbergstrasse 41B, 6300 Zug</p>
          <div className="flex flex-col items-start">
            <img src={logo} alt="Paylink Logo" className="h-[32px] mb-2" />
            <div className='flex flex-row items-center my-1'>
              <p className='text-xs font-thin'>Copyright</p>
              <img src={copyright} alt="Paylink Telif Hakkı" className="h-3 w-3 mx-1" />
              <p className='mr-1 font-bold text-purple-950'> Paylink</p>
              <p className='mx-1 font-thin text-xs'>2024</p>
            </div>
          </div>
        </div>
        
        <div className="md:w-99 w-full flex flex-col md:w-3/8 md:ml-0 px-8">
           
            <p className="mb-6 text-xs text-grayth">
            Paylink's page on the Interfax agency for information disclosure
            </p>
            <p className="mb-6 text-xs text-grayth">
            Disclosure of information as a professional securities market participant
            </p>
            <p className="mb-6 text-xs text-grayth">
            Information on interest rates on bank deposit agreements with individuals
            </p>
            <p className="mb-3 md:mb-4 text-xs text-grayth">
            The informational resource uses recommended technologies
            </p>
        </div>
        <div className="w-full md:w-2/8 mb-6 mt-6 md:mb-0 px-8">
        <p className="mb-6 text-xs font-bold">About Us</p>
          <p className="mb-6 text-xs font-bold">Service</p>
          <p className="mb-6 text-xs font-bold">Contacts</p>
          <p className="mb-6 text-xs font-bold">Support</p>
          <p className="text-xs font-bold">Data Protection</p>
        </div>
        <div className="w-full md:w-1/4 mb-6 md:mb-0 flex justify-end md:justify-start px-4">
          <div className="absolute flex-col items-center space-y-8 md:mt-0 mt-6">
          <img src={paypal} alt="PayPal" className="h-4 w-14" />
            <img src={visa} alt="Visa" className="pl-1 w-8" />
            <img src={mastercard} alt="MasterCard" className="w-8" />
          </div>
        </div>
      </div>
    </footer>

  );
};

export default FooterEng;
