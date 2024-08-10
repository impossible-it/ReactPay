import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Headers.js';
import Footer from './components/Footer.js';
import Start from './components/Start.tsx';
import Order from './components/Order.js';
import MobileOrder from './components/MobileOrder.js';
import EkvarOrder from './components/EkvarOrder.js';
import Status from './components/Status.js';

import Form from './components/Form.js';
import SimpleForm from './components/SimpleForm.js';
import Transfer from './components/Transfer.js';
import Register from './components/Register.js';
import Login from './components/Login.js';
import History from './components/History.js';

import About from './components/About.js';
import Contacts from './components/Contact.js';
import DataProtection from './components/Safety.js';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const amount = 1957; // Пример суммы

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
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
        <Route path='/status' element={<Status />} />
        <Route path='/about' element={<About />} />
        <Route path='/contacts' element={<Contacts />} />
        <Route path='/data-protection' element={<DataProtection />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
