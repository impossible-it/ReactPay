import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ReactComponent as CopyImage } from '../components/img/copy.svg';
import { ReactComponent as TetherImage } from '../components/img/tether.svg';
import RulesImage from '../components/img/rules.png';
import './styles.css';

const OrderSPB = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(location.state || {});
  const [userData, setUserData] = useState(null);
  const [orderSum, setOrderSum] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardBank, setCardBank] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [copyAlertIndex, setCopyAlertIndex] = useState(null);
  const [expandedRule, setExpandedRule] = useState(null); 
  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/userData');
      setUserData(response.data);
      if (response.data) {
        setCardNumber(response.data.cardNumber);
        setCardName(response.data.cardName);
        setCardBank(response.data.cardBank);
      }
    } catch (error) {
      console.error('Kullanıcı verilerini alma problemi:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const amount = formData.amount || 0;
    setOrderSum(amount);
  }, [formData]);

  const handleContinue = () => {
    if (formData.amount) {
      navigate('/statustur', { state: { trade: '199203', id: formData.id, userId: formData.userId } });
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

  const handleRuleClick = (index) => {
    setExpandedRule(expandedRule === index ? null : index);
  };
  const rules = [
    {
      title: "SBP hesabınızın geçerlilik süresini kontrol edin.",
      content: "SBP hesabınız veya kartınız işlemi gerçekleştirirken geçerli olmalıdır."
    },
    {
      title: "İnternet ödeme limitinizi ayarlayın.",
      content: "İnternet ödeme limitiniz bu işlemi gerçekleştirmeye izin vermelidir."
    },
    {
      title: "Tam miktarı gönderin.",
      content: "Gönderdiğiniz miktarın tam olarak gereken miktarla eşleştiğinden emin olun."
    },
    {
      title: "Yalnızca bireysel ödemeler kabul edilir.",
      content: "Sistemimiz yalnızca bireysel ödemeleri işleyebilir."
    },
    {
      title: "Girdiğiniz bilgileri kontrol edin.",
      content: "Girdiğiniz tüm bilgilerin doğru ve hatasız olduğundan emin olun."
    }
  ];

  const result = (orderSum * 0.85).toFixed(1) || '...';

  return (
    <div className="flex flex-col items-center p-4 bg-gray-fon min-h-screen">
      <div className="flex flex-col items-center space-y-4 h-full w-full md:max-w-[1070px] max-w-[390px]" >
        <div className="flex justify-between md:flex-row flex-col w-full mb-6 mt-6">
          <div className="space-y-4 md:w-[630px] w-[382px]">
            <div className="bg-white p-4 rounded-lg relative">
              {showAlert && copyAlertIndex === 0 && <div className="font-semibold text-sm text-grayth absolute top-0 right-0 mr-4">Panoya kopyalandı</div>}
              <div className='flex justify-between items-center'>
                <div className="">
                  <h2 className="text-base font-normal">Sipariş Numarası</h2>
                  <p className="text-sm mt-2 text-blueth">199203</p>
                </div>
                <button onClick={() => handleCopy('199203', 0)} className="text-blue-500"><CopyImage /></button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg relative">
              {showAlert && copyAlertIndex === 1 && <div className="font-semibold text-sm text-grayth absolute top-0 right-0 mr-4">Panoya kopyalandı</div>}
              <div className='flex justify-between items-center'>
                <div className="">
                  <h2 className="text-base font-normal">İşlem Tutarı</h2> 
                  <p className="text-sm mt-2 text-blueth">{`${formData.amount} ₺`}</p>
                </div>
                <button onClick={() => handleCopy(formData.amount || '', 1)} className="text-blue-500"><CopyImage /></button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg relative">
              {showAlert && copyAlertIndex === 2 && <div className="font-semibold text-sm text-grayth absolute top-0 right-0 mr-4">Panoya kopyalandı</div>}
              <div className='flex justify-between items-center'>
                <div className="">
                  <h2 className="text-base font-normal">Bağlı Hesap Bilgileri</h2>
                  <p className="text-sm mt-2 text-blueth">{cardNumber || 'TR02 0006 4000 0011 5260 2317 91'}</p>
                </div>
                <button onClick={() => handleCopy(cardNumber || 'TR02 0006 4000 0011 5260 2317 91', 2)} className="text-blue-500"><CopyImage /></button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="">
                <h2 className="text-base font-normal">Sağlayan Banka</h2>
                <p className="text-sm mt-2 text-blueth">{cardBank || 'Limax teknoloji bilgisayar sistemleri Ticaret Limited şirketis'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white space-y-4 rounded-lg p-4 md:w-[300px] w-[382px] md:text-right text-left">
            <div className="md:space-y-4 space-y-8 text-gray-700">
              <div className="w-full md:p-4">
                <h2 className="text-sm font-normal text-grayth">Kullanıcı Adı</h2>
                <p className="text-base mt-1">{formData.name}</p>
              </div>
              <div className="w-full md:p-4">
                <h2 className="text-sm font-normal text-grayth">Kullanıcı Numarası</h2>
                <p className="text-base mt-1">{formData.phoneNumber}</p>
              </div>
              <div className="w-full md:p-4">
                <h2 className="text-sm font-normal text-grayth">Bakiyeye Aktarıldı</h2>
                <div className='flex md:justify-end justify-start'>
                  <p className="text-base mt-1">{formData.amount } ₺</p>
                  <TetherImage className="w-5 h-5 ml-2 mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bg-white p-4 mt-4 rounded-lg flex-grow md:w-[1070px] w-[500px]">
          <div className="text-gray-700">
            <div className='flex align-center items-center mb-6'>
              <img src={RulesImage} alt="RulesImage" className="w-[25px] h-[25px] relative" />
              <h2 className="text-lg font-md ml-3">Başarılı Ödeme Kuralları</h2>
            </div>
            <ul className="md:space-y-3 space-y-3 md:pl-8 w-full">
              {rules.map((rule, index) => (
                <li
                  key={index}
                  className={`bg-gray-form rounded-xl content-center cursor-pointer md:w-[95%] w-full font-sm mx-auto ${expandedRule === index ? 'text-purple-700' : 'text-grayth'}`}
                  onClick={() => handleRuleClick(index)}
                >
                  <div className="flex justify-between items-center">
                    <p className={`text-sm font-semibold m-1 ml-4 md:w-full w-[70%] ${expandedRule === index ? 'text-purpleth' : 'text-grayth'}`}>{rule.title}</p>
                    <div className='flex justify-center w-[50px] h-[35px] items-center'>
                      <button className={`font-medium text-3xl mb-2 ${expandedRule === index ? 'text-purpleth' : 'text-grayth'}`}>{expandedRule === index ? '-' : '+'}</button>
                    </div>
                  </div>
                  {expandedRule === index && <p className="mb-2 ml-4 text-gray-600">{rule.content}</p>} </li> ))} </ul> </div> </div> <div className='p-4 mt-6 mb-6'> <button className="bg-grayth text-white py-2 px-4 rounded-lg hover md:w-[470px] w-[300px] h-[50px] text-base font-bold" onClick={handleContinue} disabled={!formData.amount} > Devam Et </button> </div> <div className="text-center pb-4 md:w-[470px] w-[300px]"> <p className="text-sm text-grayth md:mb-6 mb-12"> <a href="#" className="text-blueth">Gizlilik Politikası</a> kişisel kullanıcı bilgilerinin kullanımı için kuralları içerir. "Paylink" bu kurallara ve bilgi güvenliği gereksinimlerine uyacağını garanti eder. </p> </div> </div> </div> ); };

export default OrderSPB;
