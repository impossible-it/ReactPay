import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { sendMessage } from '../api/telegram.ts';
import { ReactComponent as CopyImage } from '../components/img/copy.svg';
import { ReactComponent as TetherImage } from '../components/img/tether.svg';
import RulesImage from '../components/img/rules.png';
import './styles.css';
import { createOrderSPB, checkTradeStatus } from '../utils/api';

const OrderSPB = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Состояния
  const [formData, setFormData] = useState(location.state || {});
  const [order, setOrder] = useState(localStorage.getItem('order') || null);
  const [rate, setRate] = useState(localStorage.getItem('rate') || null);
  const [orderSum, setOrderSum] = useState(localStorage.getItem('orderSum') || null);
  const [cardNumber, setCardNumber] = useState(localStorage.getItem('cardNumber') || '');
  const [cardName, setCardName] = useState(localStorage.getItem('cardName') || '');
  const [cardBank, setCardBank] = useState(localStorage.getItem('cardBank') || '');
  const [message, setMessage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedRule, setExpandedRule] = useState(null);
  const [copyAlertIndex, setCopyAlertIndex] = useState(null);
  const [isMessageSent, setIsMessageSent] = useState(false);

  const userId = localStorage.getItem('userId') || 'TEMP_USER';
  const result = orderSum && rate ? (orderSum / rate * 0.82).toFixed(1) : '...';

  // ✅ Сохранение данных в localStorage с проверкой
  const saveToLocalStorage = () => {
    try {
      if (order && rate && orderSum && cardNumber && cardName && cardBank) {
        localStorage.setItem('order', order);
        localStorage.setItem('rate', rate);
        localStorage.setItem('orderSum', orderSum);
        localStorage.setItem('cardNumber', cardNumber);
        localStorage.setItem('cardName', cardName);
        localStorage.setItem('cardBank', cardBank);
        localStorage.setItem('formData', JSON.stringify(formData || {}));
        localStorage.setItem('userId', userId);

        console.log('✅ Данные сохранены в localStorage');
      } else {
        console.warn('⚠️ Данные не заполнены полностью, сохранение в localStorage отменено');
      }
    } catch (error) {
      console.error('❌ Ошибка при сохранении в localStorage:', error);
    }
  };

  // ✅ Сохранение истории
  const saveToHistory = async () => {
    if (order && cardNumber && orderSum && rate) {
      try {
        await axios.post('/api/db/history', {
          trade: order,
          cardNumber,
          amount: orderSum,
          rate,
          userId,
        });
        console.log('✅ History saved');
      } catch (error) {
        console.error('❌ Error saving to history:', error);
      }
    }
  };

  // ✅ Получение данных формы
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        if (location.state?.id) {
          const response = await axios.get(`/api/db/form/${location.state.id}`);
          setFormData(response.data);
        }
      } catch (error) {
        console.error('❌ Error fetching form data:', error);
        setError('Ошибка при загрузке данных формы');
      }
    };

    if (!formData.amount) {
      fetchFormData();
    }
  }, [location.state, formData.amount]);

  // ✅ Инициализация заказа
  useEffect(() => {
    const initiateOrder = async () => {
      if (order && rate && orderSum && cardNumber && cardName && cardBank) {
        console.log('⚠️ Данные уже есть в localStorage. Пропускаем API.');
        return;
      }

      try {
        setLoading(true);
        const data = await createOrderSPB(formData.amount);
        setOrder(data.trade);
        setRate(data.rate);
        setOrderSum(data.amount);
        setCardName(data.name);
        setCardNumber(data.phone_number);
        setCardBank(data.bank);

        await saveToHistory();
        saveToLocalStorage();
        setLoading(false);
      } catch (error) {
        console.error('❌ Error creating payment request:', error);
        setError('Ошибка при создании заявки');
        setLoading(false);
      }
    };

    if (formData.amount) {
      initiateOrder();
    }
  }, [formData]);

  // ✅ Проверка статуса заявки
  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (!order || isMessageSent) return;

      try {
        const data = await checkTradeStatus(order);
        if (data?.length > 0) {
          setMessage(data[0].message);

          if (data[0].message === 'fully paid') {
            sendMessage(`Заявка закрыта №${order} на сумму ${orderSum} итого ${result} зачислено! 💰🎉`);
            setIsMessageSent(true);
          }
        }
      } catch (error) {
        console.error('❌ Error fetching trade status:', error);
        setError('Ошибка при проверке статуса заявки');
        setIsMessageSent(true);
      }
    };

    const intervalId = setInterval(fetchOrderStatus, 60000);
    fetchOrderStatus();

    return () => clearInterval(intervalId);
  }, [order, orderSum, rate, isMessageSent]);


  // ✅ Обработчик копирования
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopyAlertIndex(index);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // ✅ Переход к статусу
  const handleContinue = () => {
    if (order) {
      navigate('/status', {
        state: { order, amount: orderSum, cardNumber },
      });
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
    <div className="flex flex-col items-center p-4 bg-gray-fon min-h-screen">
      <div className="flex flex-col items-center space-y-4 h-full w-full md:max-w-[1070px] max-w-[350px]" >
        <div className="flex justify-between md:flex-row flex-col w-full mb-6 mt-6">
          <div className="space-y-4 md:w-[630px] w-[330px] " >
            <div className="bg-white p-4 rounded-lg relative">
              {showAlert && copyAlertIndex === 0 && <div className="font-semibold text-sm text-grayth absolute top-0 right-0 mr-4 ">Скопировано в буфер обмена</div>}
              <div className='flex justify-between items-center'>
                <div className="">
                  <h2 className="text-base font-normal">Номер заявки</h2>
                  <p className="text-sm mt-2 text-blueth">{order || <p className='text-blue-700 font-bold'>Загрузка..</p>}</p>
                </div>
                <button onClick={() => handleCopy(order || '', 0)} className="text-blue-500"><CopyImage /></button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg relative">
              {showAlert && copyAlertIndex === 1 && <div className="font-semibold text-sm text-grayth absolute top-0  right-0  mr-4">Скопировано в буфер обмена</div>}
              <div className='flex justify-between items-center'>
                <div className=" ">
                  <h2 className="text-base font-normal">Сумма транзакции</h2>
                  <p className="text-sm mt-2 text-blueth">{`${orderSum} RUB` || <p className='text-blue-700 font-bold'>Загрузка..</p>}</p>
                </div>
                <button onClick={() => handleCopy(orderSum || '', 1)} className="text-blue-500"><CopyImage /></button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg relative">
              {showAlert && copyAlertIndex === 2 && <div className="font-semibold text-sm text-grayth absolute top-0  right-0  mr-4">Скопировано в буфер обмена</div>}
              <div className='flex justify-between items-center'>
                <div className="0 ">
                  <h2 className="text-base font-normal">Реквизиты подвязанные к счёту</h2>
                  <p className="text-sm mt-2 text-blueth">{cardNumber || <p className='text-blue-700 font-bold'>Загрузка..</p>}</p>
                </div>
                <button onClick={() => handleCopy(cardNumber || '', 2)} className="text-blue-500"><CopyImage /></button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className=" ">
                <h2 className="text-base font-normal">Имя Фамилия</h2>
                <p className="text-sm mt-2 text-blueth">{cardName || <p className='text-blue-700 font-bold'>Загрузка..</p>}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className=" ">
                <h2 className="text-base font-normal">Обслуживающий банк</h2>
                <p className="text-sm mt-2 text-blueth">{cardBank || <p className='text-blue-700 font-bold'>Загрузка..</p>}</p>
              </div>
            </div>
          </div>
          <div className="bg-white space-y-4 rounded-lg p-4  md:w-[300px] w-[330px] md:text-right text-left md:mt-0 mt-8 " >
            <div className="md:space-y-4 space-y-8 text-gray-700">
              <div className="w-full md:p-4">
                <h2 className="text-sm font-normal text-grayth">Имя пользователя</h2>
                <p className="text-base mt-1">{formData.name || <p className='text-blue-700 font-bold'>Загрузка..</p> }</p>
              </div>
              <div className="w-full md:p-4">
                <h2 className="text-sm font-normal text-grayth">Номер пользователя</h2>
                <p className="text-base mt-1">{formData.phoneNumber || <p className='text-blue-700 font-bold'>Загрузка..</p>}</p>
              </div>
              <div className="w-full md:p-4">
                <h2 className="text-sm font-normal text-grayth">Зачислено на баланс</h2>
                <div className='flex md:justify-end justify-start'>
                  <p className="text-base mt-1">{result || <p className='text-blue-700 font-bold'>Загрузка..</p>} USDT</p>
                  <TetherImage className="w-5 h-5 ml-2 mt-1"></TetherImage>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bg-white p-4 mt-4 rounded-lg flex-grow md:w-[1070px] w-[500px] md:max-w-[1070px] max-w-[500px] " >
          <div className="text-gray-700">
            <div className='flex align-center items-center mb-6'>
              <img src={RulesImage} alt="RulesImage"  className="absolute w-[25px] h-[25px] relative" />
              <h2 className="text-lg font-md ml-3">Правила успешного платежа</h2>
            </div>
            <ul className="md:space-y-3 space-y-3 md:pl-8 w-[100%]">
              {rules.map((rule, index) => (
                <li key={index} className={`bg-gray-form rounded-xl content-center cursor-pointer md:w-[95%] w-[100%] font-sm ${expandedRule === index ? 'text-purple-700' : 'text-grayth'}`} onClick={() => handleRuleClick(index)}>
                <div className="flex justify-between items-center">
                  <p className={`text-sm font-semibold m-1 ml-4 md:w-[100%] w-[70%]  ${expandedRule === index ? 'text-purpleth' : 'text-grayth'}`}>{rule.title}</p>
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
          className="bg-grayth text-white py-2 px-4 rounded-lg hover:bg-purple-950 md:w-[470px] w-[300px] h-[50px] text-base font-bold"
          onClick={handleContinue}
          disabled={loading || !order }
        >
          Продолжить
        </button>
        </div>
        <div className="text-center pb-4  md:w-[470px] w-[300px] " >
          <p className="text-sm text-grayth md:mb-6 mb-12">
            <a href="#" className="text-blueth">Политика безопасности</a> содержит правила использования индивидуальной информации пользователей. Компания "Paylink" гарантирует соблюдение этих правил и требований к информационной безопасности как клиентам системы, так и участникам процесса предоставления услуг: банкам и поставщикам услуг и товаров.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSPB;
