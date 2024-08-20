import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as jwtDecode from 'jwt-decode';
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
  const [rate, setRate] = useState(null);
  const navigate = useNavigate(); 
  const [orderSum, setOrderSum] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedRule, setExpandedRule] = useState(null);
  const [copyAlertIndex, setCopyAlertIndex] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const userId = '1233';

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
    const maxRetries = 10; // Максимальное количество попыток
    const retryInterval = 2000; // Интервал между попытками в миллисекундах (2 секунды)

    const initiateOrder = async (attempt = 1) => {
      try {
        setLoading(true);
        const data = await createOrderSPB(formData.amount);
        console.log('Received data from API:', data);

        if (data.result === 'error' || data.code === 'E07' || data.code === 'E05') {
          if (attempt < maxRetries) {
            console.log(`Attempt ${attempt} failed. Retrying...`);
            setTimeout(() => initiateOrder(attempt + 1), retryInterval);
          } else {
            console.error('Max retries reached. Could not create order.');
            setError('Не удалось создать заявку после нескольких попыток');
            setLoading(false);
          }
        } else {
          setOrder(data.trade);
          setCard(data.card_number);
          setRate(data.rate);
          setOrderSum(data.amount);
          const [namePart, numberPart] = validateCardData(data.card_number);
          setCardName(namePart);
          setCardNumber(numberPart);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error creating payment request for SPB:', error);
        setError('Error creating payment request for SPB');
        setLoading(false);
      }
    };

    if (formData.amount) {
      initiateOrder();
    }
  }, [formData]);




  useEffect(() => {
    const saveToHistory = async () => {
      if (order && card && orderSum && rate) {
        try {
          const response = await axios.post('http://localhost:3000/api/history', {
            trade: order,
            cardNumber: card,
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

    saveToHistory();
  }, [order, card, orderSum, rate]);
  const validateCardData = (card) => {
    const nameRegex = /([A-ZА-Я][a-zа-я]+)/g;
    const numberRegex = /[\d+]/g;
    const names = card.match(nameRegex) || [];
    const numbers = card.match(numberRegex) || [];
    const namePart = names.join(' ');
    const numberPart = numbers.join('');
    return [namePart, numberPart];
  };

  const handleContinue = () => {
    if (order) {
      navigate('/status', { state: { order, userId } });
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

  

  const result = orderSum/rate*0.85||'...';

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
      <div className="flex flex-col items-center space-y-4 h-full w-full md:max-w-[1070px] max-w-[390px]" >
        <div className="flex justify-between md:flex-row flex-col w-full mb-6 mt-6">
          <div className="space-y-4 md:w-[630px] w-[382px] md:max-w-[630px] md:max-w-[382px] " >
            <div className="bg-white p-4 rounded-lg relative">
              {showAlert && copyAlertIndex === 0 && <div className="font-semibold text-sm text-grayth absolute top-0 right-0 mr-4 ">Скопировано в буфер обмена</div>}
              <div className='flex justify-between items-center'>
                <div className="">
                  <h2 className="text-base font-normal">Номер заявки</h2>
                  <p className="text-sm mt-2 text-blueth">{order || (error && <p className='text-red-500 font-bold'>Ошибка</p>)}</p>
                </div>
                <button onClick={() => handleCopy(order || '', 0)} className="text-blue-500"><CopyImage /></button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg relative">
              {showAlert && copyAlertIndex === 1 && <div className="font-semibold text-sm text-grayth absolute top-0  right-0  mr-4">Скопировано в буфер обмена</div>}
              <div className='flex justify-between items-center'>
                <div className=" ">
                  <h2 className="text-base font-normal">Сумма транзакции</h2>
                  <p className="text-sm mt-2 text-blueth">{orderSum && `RUB` || (error && <p className='text-red-500 font-bold'>Ошибка </p>)}</p>
                </div>
                <button onClick={() => handleCopy(orderSum || '', 1)} className="text-blue-500"><CopyImage /></button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg relative">
              {showAlert && copyAlertIndex === 2 && <div className="font-semibold text-sm text-grayth absolute top-0  right-0  mr-4">Скопировано в буфер обмена</div>}
              <div className='flex justify-between items-center'>
                <div className="0 ">
                  <h2 className="text-base font-normal">Реквизиты подвязанные к счёту</h2>
                  <p className="text-sm mt-2 text-blueth">{cardNumber || (error && <p className='text-red-500 font-bold'>Ошибка </p>)}</p>
                </div>
                <button onClick={() => handleCopy(cardNumber || '', 2)} className="text-blue-500"><CopyImage /></button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className=" ">
                <h2 className="text-base font-normal">Имя Фамилия</h2>
                <p className="text-sm mt-2 text-blueth">{cardName || (error && <p className='text-red-500 font-bold'>Ошибка</p>)}</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className=" ">
                <h2 className="text-base font-normal">Обслуживающий банк</h2>
                <p className="text-sm mt-2 text-blueth">{ (error && <p className='text-red-500 font-bold'>Ошибка</p>)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white space-y-4 rounded-lg p-4  md:w-[300px] w-[382px] md:text-right text-left md:w-[300px] w-[382px] md:mt-0 mt-8 " >
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
                <div className='flex md:justify-end justify-start'>
                  <p className="text-base mt-1">{result} USDT</p>
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
                <li key={index} className={`bg-gray-form rounded-xl content-center cursor-pointer md:w-[95%] w-[100%] font-sm mx-auto${expandedRule === index ? 'text-purple-700' : 'text-grayth'}`} onClick={() => handleRuleClick(index)}>
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
            <a href="#" className="text-blueth">Политика безопасности1</a> содержит правила использования индивидуальной информации пользователей. Компания "Paylink" гарантирует соблюдение этих правил и требований к информационной безопасности как клиентам системы, так и участникам процесса предоставления услуг: банкам и поставщикам услуг и товаров.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSPB;
