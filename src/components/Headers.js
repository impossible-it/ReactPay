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

        <div className="flex items-center space-x-4">
          <button
            className="text-gray-600 hover:text-gray-900 px-3 py-2 md:hidden"
            onClick={toggleMenu}
            style={{ position: 'relative' }}
          >
            <img
              src={menu}
              alt="menu"
              className="h-8 w-8 mr-2"
              onMouseEnter={(e) => e.target.style.background = 'purple'}
              onMouseLeave={(e) => e.target.style.background = 'none'}
              onClick={(e) => gsap.to(e.target, { rotate: 45, duration: 0.3 })}
              style={{ borderRadius: '10px', padding: '5px', width: '54px', height: '50px' }}
            />
          </button>
          <div className="hidden md:flex items-center space-x-4">
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
                  <span className="ml-2">История</span>
                </button>
                <button onClick={handleLogout} className="relative flex items-center">
                  <img
                    src={activeIndex === 1 ? loginactive : logiin}
                    alt="Logout"
                    className="h-6 w-6"
                    onMouseEnter={() => setActiveIndex(1)}
                    onMouseLeave={() => setActiveIndex(null)}
                  />
                  <span className="ml-2">Выйти</span>
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleBlockClick('/register')} className="relative flex items-center">
                  <img
                    src={activeIndex === 2 ? historyactive : history}
                    alt="Register"
                    className="h-6 w-6"
                    onMouseEnter={() => setActiveIndex(2)}
                    onMouseLeave={() => setActiveIndex(null)}
                  />
                  <span className="ml-2">Зарегистрироваться</span>
                </button>
                <button onClick={() => handleBlockClick('/login')} className="relative flex items-center">
                  <img
                    src={activeIndex === 3 ? loginactive : logiin}
                    alt="Login"
                    className="h-6 w-6"
                    onMouseEnter={() => setActiveIndex(3)}
                    onMouseLeave={() => setActiveIndex(null)}
                  />
                  <span className="ml-2">Войти</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div ref={menuRef} className="absolute left-0 top-full w-full bg-white shadow-md overflow-hidden z-50">
        {/* Ваши блоки меню */}
      </div>
    </nav>
  );
};

export default Header;
