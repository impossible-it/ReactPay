import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import logo from './img/logo.jpg';
import menu from './img/menu.png';

import transferImage from '../components/img/transfer.png';
import contactImage from '../components/img/contact.png';
import aboutusImage from '../components/img/aboutus.png';
import defenseImage from '../components/img/defens.png';

const HeaderTur = ({ isAuthenticated, setIsAuthenticated }) => {
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
      if (window.innerWidth < 768) {
        // Mobil davranış
        gsap.to(menuRef.current, {
          height: 'auto',  // İçeriğe göre yüksekliği ayarla
          duration: 0.5,
          ease: 'power2.out',
        });
        gsap.to('.page-content', {
          y: '100vh',  // Mobilde içeriği ekranın altına taşı
          duration: 0.5,
          ease: 'power2.out',
        });
      } else {
        // Masaüstü davranış
        gsap.to(menuRef.current, {
          height: 'auto',
          duration: 0.5,
          ease: 'power2.out',
        });
      }
    } else {
      gsap.to(menuRef.current, {
        height: 0,
        duration: 0.5,
        ease: 'power2.in',
      });
      gsap.to('.page-content', {
        y: '0px',
        duration: 0.5,
        ease: 'power2.in',
      });
    }
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  const NavigateHome = () => {
    window.location.href = '/startp';
  };

  const NavigateLogin = () => {
    window.location.href = '/login';
  };

  const NavigateRegister = () => {
    window.location.href = '/register';
  };

  const NavigateHistory = () => {
    window.location.href = '/history';
  };

  const handleMouseEnter = (index) => {
    gsap.to(blocksRef.current[index], {
      scale: 1.1,
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
      duration: 0.3,
    });
  };

  const handleMouseLeave = (index) => {
    gsap.to(blocksRef.current[index], {
      scale: 1,
      boxShadow: '0px 0px 0px rgba(0, 0, 0, 0)',
      duration: 0.3,
    });
  };

  const handleBlockClick = (path, index) => {
    setActiveIndex(index);
    setMenuOpen(false); // Menü kapat
    navigate(path);
  };

  return (
    <nav className="relative bg-white shadow-md py-4 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center">
          <img src={logo} alt="Şirket Logosu" className="h-25 w-25 mr-2" />
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="text-gray-600 hover:text-gray-900 px-3 py-2 md:hidden"
            onClick={toggleMenu}
          >
            <img src={menu} alt="menü" className="h-8 w-8 mr-2" />
          </button>
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button
                  // onClick={NavigateHistory}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Geçmiş
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={NavigateRegister}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Kayıt Ol
                </button>
                <button
                  onClick={NavigateLogin}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2"
                >
                  Giriş Yap
                </button>
              </>
            )}
            <button
              className="text-gray-600 hover:text-gray-900 px-3 py-2"
              onClick={toggleMenu}
            >
              <img src={menu} alt="menü" className="h-8 w-8 mr-2" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={menuRef}
        className="absolute left-0 top-full w-full bg-white shadow-md overflow-hidden z-50"
      >
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 py-4">
          {[
            {
              img: transferImage,
              alt: 'Transfer',
              text: 'Transferler',
              path: '/transfertur',
            },
            {
              img: aboutusImage,
              alt: 'Hakkımızda',
              text: 'Hakkımızda',
              path: '/abouttr',
            },
            {
              img: defenseImage,
              alt: 'Veri Koruma',
              text: 'Veri Koruma',
              path: '/datatu',
            },
            {
              img: contactImage,
              alt: 'İletişim',
              text: 'İletişim',
              path: '/contactstr',
            },
          ].map((block, index) => (
            <div
              key={index}
              ref={(el) => (blocksRef.current[index] = el)}
              className={`flex flex-col items-center justify-center p-2 md:w-[200px] w-[50%] md:h-[150px] h-[125px] rounded-lg cursor-pointer transition-transform duration-300 mb-4 ${
                activeIndex === index ? 'bg-grayth' : ''
              }`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              onClick={() => handleBlockClick(block.path, index)}
            >
              <span className="mb-2 font-bold">{block.text}</span>
              <img src={block.img} alt={block.alt} className="h-16 w-16" />
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default HeaderTur;
