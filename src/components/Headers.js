import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import logo from './img/logo.jpg';
import menu from './img/menu.png';
import transferImage from '../components/img/transfer.svg';
import contactImage from '../components/img/contact.svg';
import aboutusImage from '../components/img/aboutus.svg';
import defenseImage from '../components/img/defens.svg';

import logiin from '../components/img/logiin.png';
import loginactive from '../components/img/loginactive.png';
import history from '../components/img/history.png';
import historyactive from '../components/img/historyactive.png';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const menuRef = useRef(null);
  const blocksRef = useRef([]);
  const navigate = useNavigate();

  // Проверка токена и установка аутентификации
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  // Анимация открытия/закрытия меню
  useEffect(() => {
    if (menuOpen) {
      gsap.to(menuRef.current, { height: 'auto', duration: 0.5, ease: 'power2.out' });
    } else {
      gsap.to(menuRef.current, { height: 0, duration: 0.5, ease: 'power2.in' });
    }
  }, [menuOpen]);

  // Переключение меню
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    const menuIcon = document.querySelector('.menu-icon');
    // Поворот и возврат меню иконки на 45 градусов
    gsap.to(menuIcon, { rotate: menuOpen ? 0 : 45, duration: 0.3 });
    if (!menuOpen) {
      setTimeout(() => gsap.to(menuIcon, { rotate: 0, duration: 0.3 }), 500);
    }
  };

  // Выход из системы
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  // Анимация кнопок при наведении
  const handleMouseEnter = (index) => {
    setActiveIndex(index);
    gsap.to(blocksRef.current[index], {
      scale: 1.1,
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
      duration: 0.3,
    });
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
    blocksRef.current.forEach((block) => {
      gsap.to(block, { scale: 1, boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)', duration: 0.3 });
    });
  };

  // Обработка клика по блокам навигации
  const handleBlockClick = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="relative bg-white shadow-md py-4 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center">
          <img src={logo} alt="Company Logo" className="h-25 w-25 mr-2" />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button onClick={() => handleBlockClick('/history')} className="relative flex items-center">
                  <img
                    src={activeIndex === 0 ? historyactive : history}
                    alt="History"
                    className="h-6 w-6"
                    onMouseEnter={() => setActiveIndex(0)}
                    onMouseLeave={() => setActiveIndex(null)}
                  />
                  <span className={`ml-2 ${activeIndex === 0 ? 'text-white' : 'text-purpleth'}`}>История</span>
                </button>
                <button onClick={handleLogout} className="relative flex items-center">
                  <img
                    src={activeIndex === 1 ? loginactive : logiin}
                    alt="Logout"
                    className="h-6 w-6"
                    onMouseEnter={() => setActiveIndex(1)}
                    onMouseLeave={() => setActiveIndex(null)}
                  />
                  <span className={`ml-2 ${activeIndex === 1 ? 'text-white' : 'text-purpleth'}`}>Выйти</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                {/* Кнопка Зарегистрироваться */}
                <div
                  className="relative flex justify-center items-center max-w-[250px] p-2 h-[50px] bg-[rgba(250,249,255,1)] rounded-lg transition-colors duration-300 cursor-pointer"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(48,12,96,1)';
                    e.currentTarget.querySelector('span').style.color = 'white';
                    e.currentTarget.querySelector('img').src = historyactive;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(250,249,255,1)';
                    e.currentTarget.querySelector('span').style.color = 'purpleth';
                    e.currentTarget.querySelector('img').src = history;
                  }}
                >
                  <button
                    onClick={() => handleBlockClick('/register')}
                    className="relative flex items-center justify-center w-full h-full"
                  >
                    <img src={history} alt="Register" className="h-6 w-6" />
                    <span className="ml-2 text-purpleth">Зарегистрироваться</span>
                  </button>
                </div>
                {/* Кнопка Войти */}
                <div
                  className="relative flex justify-center items-center max-w-[250px] p-2 h-[50px] bg-[rgba(250,249,255,1)] rounded-lg transition-colors duration-300 cursor-pointer"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(48,12,96,1)';
                    e.currentTarget.querySelector('span').style.color = 'white';
                    e.currentTarget.querySelector('img').src = loginactive;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(250,249,255,1)';
                    e.currentTarget.querySelector('span').style.color = 'purpleth';
                    e.currentTarget.querySelector('img').src = logiin;
                  }}
                >
                  <button
                    onClick={() => handleBlockClick('/login')}
                    className="relative flex items-center justify-center w-full h-full"
                  >
                    <img src={logiin} alt="Login" className="h-6 w-6" />
                    <span className="ml-2 text-purpleth">Войти</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Бургер-меню, которое теперь находится справа */}
          <button
            className="text-gray-600 hover:text-gray-900 px-3 py-2"
            onClick={toggleMenu}
            style={{ position: 'relative' }}
          >
            <div
              className="flex items-center justify-center w-[54px] h-[50px] bg-[rgba(250,249,255,1)] rounded-md transition-colors menu-icon"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(48,12,96,1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(250,249,255,1)')}
            >
              <img src={menu} alt="menu" className="h-8 w-8" />
            </div>
          </button>
        </div>
      </div>
      <div ref={menuRef} className="absolute left-0 top-full w-full bg-white shadow-md overflow-hidden z-50">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 py-4">
          {[
            {
              img: transferImage,
              alt: 'Translation',
              text: 'Переводы',
              path: '/transferdm',
              description: 'Переводите деньги быстро и безопасно с помощью нашего сервиса.',
            },
            {
              img: aboutusImage,
              alt: 'About Us',
              text: 'О нас',
              path: '/abouts',
              description: 'Узнайте больше о нашей компании и нашей миссии.',
            },
            {
              img: defenseImage,
              alt: 'Protection',
              text: 'Защита данных',
              path: '/securityinfo',
              description: 'Обеспечиваем надежную защиту ваших данных.',
            },
            {
              img: contactImage,
              alt: 'Contacts',
              text: 'Контакты',
              path: '/contacts',
              description: 'Свяжитесь с нами для получения поддержки и информации.',
            },
          ].map((block, index) => (
            <div className='flex flex-col justify-center items-center mb-4' key={index}>
              <div
                ref={(el) => (blocksRef.current[index] = el)}
                className={`flex flex-row items-center justify-center p-2 w-[190px] h-[50px] rounded-lg cursor-pointer transition-transform duration-300 ${
                  activeIndex === index ? 'bg-purpleth' : ''
                }`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleBlockClick(block.path, index)}
              >
                <img
                  src={block.img}
                  alt={block.alt}
                  className={`h-[25px] w-[25px] transition-colors duration-300 ${
                    activeIndex === index ? 'text-white' : 'text-purpleth'
                  }`}
                  style={{ filter: activeIndex === index ? 'brightness(0) saturate(100%) invert(100%)' : 'none' }}
                />
                <span
                  className={`ml-2 transition-colors duration-300 ${
                    activeIndex === index ? 'text-white' : 'text-purpleth'
                  }`}
                >
                  {block.text}
                </span>
              </div>
              <p className="text-purpleth w-[50%] text-center">{block.description}</p>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Header;

