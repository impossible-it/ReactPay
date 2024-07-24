import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LuCopyPlus } from "react-icons/lu";
import { sendMessage } from '../api/telegram.ts';
import { createOrderSPB } from '../utils/api';
import axios from 'axios';
import { ReactComponent as CopyImage } from '../components/img/copy.svg';
import { ReactComponent as TetherImage } from '../components/img/tether.svg';

import RulesImage from '../components/img/rules.png';

import './styles.css';

const OrderSPB = () => {
  const location = useLocation();
  const [formData, setFormData] = useState(location.state || {});
  const [order, setOrder] = useState(null);
  const [card, setCard] = useState(null);
  const [orderSum, setOrderSum] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedRule, setExpandedRule] = useState(null);
  const [copyAlertIndex, setCopyAlertIndex] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/form/${location.state.id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching form data:', error);
        setError('Error fetching form data');
      }
    };

    if (location.state && location.state.id) {
      fetchFormData();
    }
  }, [location.state]);

  useEffect(() => {
    const initiateOrder = async () => {
      try {
        setLoading(true);
        const data = await createOrderSPB(formData.amount);
        setOrder(data.trade);
        setCard(data.card_number);
        setOrderSum(data.amount);
        // Валидируем переменную card
        const [namePart, numberPart] = validateCardData(data.card_number);
        setCardName(namePart);
        setCardNumber(numberPart);
        setLoading(false);
        // Сохранение заявки в истории
        saveOrderToHistory(data.trade, numberPart, data.amount, 'Успешно');
      } catch (error) {
        console.error('Error creating payment request for SPB:', error);
        setError('Error creating payment request for SPB');
        setLoading(false);
        // Сохранение ошибки в истории
        saveOrderToHistory('Ошибка', 'Ошибка', formData.amount, 'Не удалось создать заявку');
      }
    };

    if (formData.amount) {
      initiateOrder();
    }
  }, [formData]);

  const validateCardData = (card) => {
    const nameRegex = /([A-ZА-Я][a-zа-я]+)/g;
    const numberRegex = /[\d+]/g;
    const names = card.match(nameRegex) || [];
    const numbers = card.match(numberRegex) || [];
    const namePart = names.join(' ');
    const numberPart = numbers.join('');
    return [namePart, numberPart];
  };

  const saveOrderToHistory = async (trade, cardNumber, amount, status) => {
    try {
      await axios.post(`http://localhost:3000/api/history`, {
        trade,
        cardNumber,
        amount,
        status,
        userId: formData.userId // передаем ID пользователя
      });
    } catch (error) {
      console.error('Error saving order to history:', error);
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopyAlertIndex(index);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleTelegram = async () => {
    try {
      if (order && orderSum && card) {
        await sendMessage(`Заявка №: ${order}, Сума: ${orderSum} RUB, Картка: ${card}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleRuleClick = (index) => {
    setExpandedRule(expandedRule === index ? null : index);
  };

  const rules = [
    {
      title: "Проверьте срок действия cчета СБП.",
      content: "Срок действия счета СБП или карты к которому он подвязан должен быть действителен на момент проведения операции."
    },
    {
      title: "Отрегулируй лимит на интернет-платежи.",
      content: "Убедитесь, что ваш лимит на интернет-платежи позволяет выполнить эту транзакцию."
    },
    {
      title: "Переведите точную сумму.",
      content: "Проверьте, что введенная сумма перевода точно соответствует требуемой сумме."
    },
    {
      title: "Переводы принимаются от физических лиц.",
      content: "Только переводы от физических лиц могут быть обработаны нашей системой."
    },
    {
      title: "Проверь введённые данные.",
      content: "Убедитесь, что все введенные данные верны и не содержат ошибок."
    }
  ];

  return (
    <div className="flex flex-col items-center p-4 bg-gray-fon">
      <div className="flex flex-col items-center " style={{ maxWidth: '1070px', width: '100%' }}>
        <div className="flex justify-between w-full  mb-6 mt-6">
          <div className="space-y-4" style={{ maxWidth: '630px', width: '630px' }}>
            <div className="bg-white p-4 rounded-lg relative">
              {showAlert && copyAlertIndex === 0 && <div className="font-semibold text-sm text-grayth absolute top-0 right-0 transform my-2 mr-4">Скопировано в буфер обмена</div>}
              <div className='flex justify-between items-center'>
                <div className="">
                  <h2 className="text-base font-normal">Номер заявки</h2>
                  <p className="text-sm mt-2 text-blueth">{order || (error && <p className='text-red-500 font-bold'>Ошибка создания заявки...</p>)}</p>
                </div>
                <button onClick={() => handleCopy(order || '', 0)} className="text-blue-500"><CopyImage /></button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg relative">
              {showAlert && copyAlertIndex === 1 && <div className="font-semibold text-sm text-grayth absolute top-0 right-0 transform my-2 mr-4">Скопировано в буфер обмена</div>}
              <div className='flex justify-between items-center'>
                <div className=" ">
                  <h2 className="text-base font-normal">Сумма транзакции</h2>
                  <p className="text-sm mt-2 text-blueth">{orderSum && `RUB` || (error && <p className='text-red-500 font-bold'>Ошибка создания заявки...</p>)}</p>
                </div>
                <button onClick={() => handleCopy(orderSum || '', 1)} className="text-blue-500"><CopyImage /></button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg relative">
              {showAlert && copyAlertIndex === 2 && <div className="font-semibold text-sm text-grayth absolute top-0 right-0 transform my-2 mr-4">Скопировано в буфер обмена</div>}
              <div className='flex justify-between items-center'>
                <div className="0 ">
                  <h2 className="text-base font-normal">Реквизиты подвязанные к счёту</h2>
                  <p className="text-sm mt-2 text-blueth">{card || (error && <p className='text-red-500 font-bold'>Ошибка создания заявки...</p>)}</p>
                </div>
                <button onClick={() => handleCopy(card || '', 2)} className="text-blue-500"><CopyImage /></button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className=" ">
                <h2 className="text-base font-normal">Имя Фамилия</h2>
                <p className="text-sm mt-2 text-blueth">{cardName || (error && <p className='text-red-500 font-bold'>Ошибка создания заявки...</p>)}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className=" ">
                <h2 className="text-base font-normal">Орган ответственный за перевод</h2>
                <p className="text-sm mt-2 text-blueth">{<p>Операционный департамент Банка России УФК г. Москва</p> || (error && <p className='text-red-500 font-bold'>Ошибка создания заявки</p>)}</p>
              </div>
            </div>
            
          </div>

          <div className="bg-white space-y-4 rounded-lg p-4 text-right" style={{ maxWidth: '300px', width: '300px' }}>
            <div className="space-y-3 text-gray-700">
              <div className="w-full p-4">
                <h2 className="text-sm font-normal text-grayth">Имя пользователя</h2>
                <p className="text-base">{formData.name}</p>
              </div>
              <div className="w-full p-4">
                <h2 className="text-sm font-normal text-grayth">Номер пользователя</h2>
                <p className="text-base">{formData.phoneNumber}</p>
              </div>
              <div className="w-full p-4">
                <h2 className="text-sm font-normal text-grayth">Зачислено на баланс</h2>
                <div className='flex justify-end'>
                  <p className="text-base">{formData.amount} USDT</p>
                  <TetherImage className="w-5 h-5 ml-2 mt-1"></TetherImage>
                </div>
              </div>
              <div className="w-full p-4">
                <h2 className="text-sm font-normal text-grayth">Номер клиента</h2>
                <p className="text-base">{formData.clientNumber}</p>
              </div>
             
            </div>
          </div>
        </div>

        <div className="w-full bg-white p-4 mt-4 rounded-lg" style={{ maxWidth: '1070px', width: '1070px' }}>
          <div className="text-gray-700">
            <div className='flex align-center items-center mb-6'>
              <img src={RulesImage} alt="RulesImage"  className="absolute w-[25px] h-[25px] relative" />
              <h2 className="text-lg font-md ml-3">Правила успешного платежа</h2>
            </div>
            <ul className="space-y-2 pl-8">
              {rules.map((rule, index) => (
                <li key={index} className={`bg-gray-form rounded-xl content-center cursor-pointer mx-auto${expandedRule === index ? 'text-purple-700' : 'text-grayth'}`} style={{ width: '95%', fontSize: '14px' }} onClick={() => handleRuleClick(index)}>
                <div className="flex justify-between items-center">
                  <p className={`text-sm font-semibold	 ml-4 ${expandedRule === index ? 'text-purpleth' : 'text-grayth'}`}>{rule.title}</p>
                  <div className='flex justify-center w-[50px] h-[35px] items-center'>
                    <button className={`font-medium text-3xl mb-2 ${expandedRule === index ? 'text-purpleth' : 'text-grayth'}`}>{expandedRule === index ? '-' : '+'}</button>
                  </div>
                </div>
                  {expandedRule === index && <p className=" mb-2 ml-4 text-gray-600">{rule.content}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='p-4 mt-6 mb-6'>
        <button
          className="bg-grayth text-white py-2 px-4 rounded-lg hover:bg-purple-950"
          style={{ maxWidth: '470px', width: '470px', height: '50px', fontSize: '16px', fontWeight: '700' }}
          onClick={handleTelegram}
          disabled={loading || !order || !orderSum || !card}
        >
          Продолжить
        </button>
        </div>
        <div className="text-center pb-4 mb-6 " style={{ maxWidth: '470px', width: '470px', }}>
          <p className="text-sm text-grayth">
            <a href="#" className="text-blueth">Политика безопасности</a> содержит правила использования индивидуальной информации пользователей. Компания "Paylink" гарантирует соблюдение этих правил и требований к информационной безопасности как клиентам системы, так и участникам процесса предоставления услуг: банкам и поставщикам услуг и товаров.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSPB;
