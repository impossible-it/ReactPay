import React, { useState, useEffect } from 'react';

import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/Headers.js'
import Footer from './components/Footer.js'
import Start from './components/Start.tsx'
import Order from './components/Order.js'
import MobileOrder from './components/MobileOrder.js'
import EkvarOrder from './components/EkvarOrder.js'
import Status from './components/Status.js'

import Form from './components/Form.js'
import SimpleForm from './components/SimpleForm.js'

import Transfer from './components/Transfer.js'

import Register from './components/Register.js';
import Login from './components/Login.js';
import History from './components/History.js';







const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const amount = 1957; // Пример суммы

  return (
    <Router>
      {/* Header */}
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/> 
      {/*  */}


      <Routes>
        <Route path='/startp' element= {<Start/>}></Route>
      </Routes>


      <Routes>
        <Route path='/order' element= {<Order amount={amount} />}></Route>
      </Routes>

      
      <Routes>
        <Route path='/orderspb' element= {<MobileOrder amount={amount} />}></Route>
      </Routes>

      <Routes>
        <Route path='/orderother' element= {<EkvarOrder amount={amount} />}></Route>
      </Routes>
      

      <Routes>
        <Route path='/register' element= {<Register/>}></Route>
      </Routes>
       


      <Routes>
        <Route path='/login' element= {<Login setIsAuthenticated={setIsAuthenticated}/>}></Route>
      </Routes>


      <Routes>
        <Route path='/history' element= {<History/>}></Route>
      </Routes>

      <Routes>
        <Route path='/transfer/createrequest' element= {<Form/>}></Route>
      </Routes>

      <Routes>
        <Route path='/transfermbbpp320db' element= {<SimpleForm/>}></Route>
      </Routes>

      <Routes>
        <Route path='/transfer' element= {<Transfer/>}></Route>
      </Routes>

      <Routes>
        <Route path='/status' element= {<Status/>}></Route>
      </Routes>

      {/* Footer */}
      <Footer/>
      {/*  */}
    </Router>
  );
}

export default App;
