import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Headers.js'; // Добавьте компонент заголовка для ru1 версии
import Footer from './components/Footer.js';
import HeaderEng from './components/HeadersEng.js'; // Добавьте компонент заголовка для eng версии
import FooterEng from './components/FooterEng.js';
import HeaderTur from './components/HeadersTur.js'; // Добавьте компонент заголовка для турецкой версии
import FooterTur from './components/FooterTur.js'; 

import HeaderD from './components/HeadersDouble.js'; // Добавьте компонент заголовка для ru2 версии


import Start from './components/Start.tsx';
import Order from './components/Order.js';
import MobileOrder from './components/MobileOrder.js';
import EkvarOrder from './components/EkvarOrder.js';
import Status from './components/Status.js';
import MobileKot from './components/mobile/Mobile.tsx';

import Form from './components/Form.js';
import SimpleForm from './components/SimpleForm.js';
import Transfer from './components/Transfer.js';
import Register from './components/Register.js';
import Login from './components/Login.js';
import History from './components/History.js';

import TransferD from './components/TransferDouble.js';
import FormD from './components/FormDouble.js';
import OrderD from './components/OrderDouble.js';
import MobileOrderD from './components/MobileOrderDouble.js';
import StatusD from './components/StatusDouble.js';

import About from './components/About.js';
import Contacts from './components/Contact.js';
import DataProtection from './components/Safety.js';

import EkvarMaEng from './components/EkvarMaEng.js';
import TransferEng from './components/TransferEng.js';
import FormEng from './components/FormEng.js';
import EkvarOrderEng from './components/EkvarEng.js';
import StatusEng from './components/StatusEng.js';

import DataTur from './components/DataTur.js'
import OrderTur from './components/MobileOrderTur.js'; 
import TransferTur from './components/TransferTur.js';
import FormTur from './components/FormTur.js';
import StatusTur from './components/StatusTur.js';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const amount = 1957; // Пример суммы

  // Функция для определения, используется ли английская версия страницы
  const isEnglishRoute = () => {
    return window.location.pathname.includes('eng');
  };

  // Функция для определения, используется ли турецкая версия страницы
  const isTurkishRoute = () => {
    return window.location.pathname.includes('tur');
  };
  const isRuRuRoute = () => {
    return window.location.pathname.includes('dm');
  };

  return (
    <Router>
      {isEnglishRoute() ? (
        <HeaderEng isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      ) : isTurkishRoute() ? (
        <HeaderTur isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      ) : isRuRuRoute() ? (
        <HeaderD isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} /> 
      ) : (
        <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      ) }

      <Routes>
        <Route path='/startp' element={<Start />} />
        <Route path='/order' element={<Order amount={amount} />} />
        <Route path='/orderspb' element={<MobileOrder amount={amount} />} />
        <Route path='/orderother' element={<EkvarOrder amount={amount} />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path='/history' element={<History />} />
        <Route path='/transfer/createrequest' element={<Form />} />
        <Route path='/transfermbbpp320db' element={<SimpleForm />} />
        <Route path='/transfer' element={<Transfer />} />
        <Route path='/status' element={<Status amount={amount} />} />
        <Route path='/about' element={<About />} />
        <Route path='/contacts' element={<Contacts />} />
        <Route path='/data-protection' element={<DataProtection />} />
        <Route path='/mobile' element={<MobileKot />} />


        <Route path='/transferdm' element={<TransferD />} />
        <Route path='/transferdm/createrequest' element={<FormD />} />
        <Route path='/statusdm' element={<StatusD amount={amount} />} />
        <Route path='/orderdm' element={<OrderD amount={amount} />} />
        <Route path='/orderspbdm' element={<MobileOrderD amount={amount} />} />

        {/* Английская версия */}
        <Route path='/transfereng' element={<TransferEng />} />
        <Route path='/orderothereng' element={<EkvarOrderEng />} />
        <Route path='/orderothermaeng' element={<EkvarMaEng />} />
        <Route path='/transfer/createrequesteng' element={<FormEng />} />
        <Route path='/statuseng' element={<StatusEng />} />

        {/* Турецкая версия */}
        <Route path='/datatur' element={<DataTur />} />
        <Route path='/transfertur' element={<TransferTur />} />
        <Route path='/ordertur' element={<OrderTur />} />
        <Route path='/transfer/createrequesttur' element={<FormTur />} />
        <Route path='/statustur' element={<StatusTur />} />
      </Routes>

      {isEnglishRoute() ? (
        <FooterEng />
      ) : isTurkishRoute() ? (
        <FooterTur />
      ) : (
        <Footer />
      )}
    </Router>
  );
}

export default App;
