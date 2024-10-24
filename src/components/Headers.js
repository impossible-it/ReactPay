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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  useEffect(() => {
    if (menuOpen) {
      gsap.to(menuRef.current, { height: 'auto', duration: 0.5, ease: 'power2.out' });
    } else {
      gsap.to(menuRef.current, { height: 0, duration: 0.5, ease: 'power2.in' });
    }
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

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

        {/* Бургер меню */}
        <button
          className="text-gray-600 hover:text-gray-900 px-3 py-2"
          onClick={toggleMenu}
        >
          <div
            className="flex items-center justify-center w-[54px] h-[50px] bg-[rgba(250,249,255,1)] rounded-md transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(48,12,96,1)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(250,249,255,1)')}
          >
            <img src={menu} alt="menu" className="h-8 w-8 mr-2" />
          </div>
        </button>
      </div>

      <div ref={menuRef} className="absolute left-0 top-full w-full bg-white shadow-md overflow-hidden z-50">
        <div className="flex flex-col justify-center items-center gap-4 py-4">
          {/* Кнопки для неаутентифицированных пользователей */}
          {!isAuthenticated ? (
            <>
              <div
                className="flex items-center justify-center p-2 w-[190px] h-[50px] bg-[rgba(250,249,255,1)] rounded-lg cursor-pointer"
                onClick={() => handleBlockClick('/login')}
              >
                <img src={logiin} alt="Login" className="h-6 w-6" />
                <span className="ml-2 text-purpleth">Войти</span>
              </div>
              <div
                className="flex items-center justify-center p-2 w-[190px] h-[50px] bg-[rgba(250,249,255,1)] rounded-lg cursor-pointer"
                onClick={() => handleBlockClick('/register')}
              >
                <img src={history} alt="Register" className="h-6 w-6" />
                <span className="ml-2 text-purpleth">Зарегистрироваться</span>
              </div>
            </>
          ) : (
            <>
              <div
                className="flex items-center justify-center p-2 w-[190px] h-[50px] bg-[rgba(250,249,255,1)] rounded-lg cursor-pointer"
                onClick={() => handleBlockClick('/history')}
              >
                <img src={history} alt="History" className="h-6 w-6" />
                <span className="ml-2 text-purpleth">История</span>
              </div>
              <div
                className="flex items-center justify-center p-2 w-[190px] h-[50px] bg-[rgba(250,249,255,1)] rounded-lg cursor-pointer"
                onClick={handleLogout}
              >
                <img src={logiin} alt="Logout" className="h-6 w-6" style={{ transform: 'scaleX(-1)' }} />
                <span className="ml-2 text-purpleth">Выйти</span>
              </div>
            </>
          )}

          {/* Остальные элементы меню */}
          {[
            {
              img: transferImage,
              alt: 'Translation',
              text: 'Переводы',
              path: '/transferdm',
            },
            {
              img: aboutusImage,
              alt: 'About Us',
              text: 'О нас',
              path: '/abouts',
            },
            {
              img: defenseImage,
              alt: 'Protection',
              text: 'Защита данных',
              path: '/securityinfo',
            },
            {
              img: contactImage,
              alt: 'Contacts',
              text: 'Контакты',
              path: '/contacts',
            },
          ].map((block, index) => (
            <div
              ref={(el) => (blocksRef.current[index] = el)}
              className={`flex items-center justify-center p-2 w-[190px] h-[50px] bg-[rgba(250,249,255,1)] rounded-lg cursor-pointer`}
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleBlockClick(block.path)}
            >
              <img src={block.img} alt={block.alt} className="h-6 w-6" />
              <span className="ml-2 text-purpleth">{block.text}</span>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Header;
