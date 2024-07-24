import React, { useState } from 'react';

const OrderOther = () => {
  const [showAlert, setShowAlert] = useState(true);
  const [step, setStep] = useState(1);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    name: '',
    cvv: '',
    expiryDate: '',
    amount: '',
    agreement: false
  });
  const [smsCode, setSmsCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCardData({
      ...cardData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSmsSend = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 2000);
  };

  const handleSmsSubmit = () => {
    setVerificationLoading(true);
    setTimeout(() => {
      setVerificationLoading(false);
      setVerificationSuccess(true);
      setStep(3);
    }, 3000);
  };

  if (showAlert) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-md text-center">
          <p className="mb-4">Ваши данные никуда не передаются и с ними все хорошо.</p>
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            onClick={handleAlertClose}
          >
            OK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-fon px-4 pt-20 placeholder-gray-text">
      <div className="space-y-4 w-full max-w-xl" style={{ maxWidth: '608px' }}>
        <div className="bg-white p-6 rounded-lg mb-12">
          <h2 className="text-xl font-bold mb-6 text-center">Способ оплаты</h2>
          <div className="flex justify-center space-x-4 mb-4">
            <button className="py-2 px-4  bg-white border-b-2 border-blue-400 hover:border-blue-800">Банковская карта</button>
            <button className="py-2 px-4  bg-white border-b-2 border-gray-200 hover:border-blue-800">Мобильный оператор</button>

          </div>
          <div className="flex justify-center space-x-4 mb-2">
          <p className="text-left mt-4" style={{ color: 'rgba(175, 168, 198, 1)', fontSize:'12px', width:'470px'}}>Необходимо выбрать удобный Вам способ оплаты</p>
          </div>
        </div>
        <div className="w-full max-w-xl bg-white p-6 rounded-lg " style={{ maxWidth: '608px' , display:'flex',  justifyContent:'center' }}>
          {step === 1 && (
            <form className="text-grayth" style={{ maxWidth: '470px', }}>
              <div className="mt-6 mb-6 text-left" style={{ width: '100%' }}>
                <label htmlFor="cardNumber" className="block  font-normal text-gray-700" >
                  Укажите номер Вашей карты
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  id="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleChange}
                  className="mt-1 block w-full border bg-gray-form border-gray-200 rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md"
                  maxLength="16"
                  placeholder="1456 1345 0958 4234"
                  required
                  style={{ width: '100%', height: '35px' }}
                />
              </div>
              <div className="mb-6 text-left" style={{ width: '100%' }}>
                <label htmlFor="name" className="block font-normal text-gray-700" >
                  Укажите Ваше имя и фамилию
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={cardData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border bg-gray-form border-gray-200 rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md"
                  placeholder="Иван Иванов"
                  required
                  style={{ width: '100%', height: '35px' }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-12 text-left" style={{ width: '100%' }}>
                  <label htmlFor="expiryDate" className="block  font-normal text-gray-700" >
                    Срок действия
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    id="expiryDate"
                    value={cardData.expiryDate}
                    onChange={handleChange}
                    className="mt-1 block w-full border bg-gray-form border-gray-200 rounded-md p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md"
                    placeholder="21 / 05"
                    required
                    style={{ width: '100%', height: '35px' }}
                  />
                </div>
                <div className="mb-12 text-left" style={{ width: '100%' }}>
                  <label htmlFor="cvv" className="block  font-normal text-gray-700" >
                    CVV2
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    id="cvv"
                    value={cardData.cvv}
                    onChange={handleChange}
                    className="mt-1 block w-full border bg-gray-form border-gray-200 rounded-md  p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md"
                    maxLength="3"
                    placeholder="227"
                    required
                    style={{ width: '100%', height: '35px' }}
                  />
                </div>
              </div>
              <div className="mb-6 text-left" style={{ width: '100%' }}>
                <label htmlFor="amount" className="block  font-normal text-gray-700" >
                  Укажите сумму инвестиции
                </label>
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  value={cardData.amount}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-gray-form border-gray-200 rounded-md  p-2 focus:bg-white focus:border-neutral-700 focus:shadow-md"
                  placeholder="10 000 руб"
                  required
                  style={{ width: '100%', height: '35px' }}
                />
              </div>
              <button
                type="button"
                className="bg-grayth text-white py-2 px-4 rounded-md hover:bg-purple-950 mt-6 w-full"
                onClick={handleSmsSend}
                style={{ width: '100%', height: '50px' }}
              >
                Продолжить
              </button>
              <div className="mt-6 flex items-center justify-between" style={{ width: '100%' }}>
                <label htmlFor="agreement" className="block  font-normal text-gray-700">
                  Подтверждаете пользовательское соглашение?
                </label>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="agreement"
                    id="agreement"
                    checked={cardData.agreement}
                    onChange={handleChange}
                    required
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <p className="mt-4 text-left text-sm text-gray-600" style={{ width: '100%' }}>
                Нажимая на кнопку "Оплатить", вы подтверждаете что ознакомлены с перечнем информации об услуге и принимаете 
                <span className="text-blue-400 font-normal"> условия публичного договора.</span>
              </p>
            </form>
          )}
          {step === 2 && (
           <div className='flex flex-col justify-center items-center text-center'style={{width: '470px'}}>
              <h2 className="text-xl font-bold mb-4">Подтверждение</h2>
              <p className="text-sm text-gray-700 mb-4">
                Для подтверждения перевода средств мы отправили Вам код из 6 (шести) цифр на номер телефона в личные сообщения (СМС). ВНИМАНИЕ! Никому не сообщайте код из СМС, для защиты ваших персональных данных!
              </p>
              <div className="flex justify-center items-center mb-4">
                <div className="w-20 h-20 border-4 border-blue-500 rounded-full flex items-center justify-center text-blue-500 text-2xl">
                  4:18
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">Осталось для подтверждения</p>
              <div className="mb-4">
                <label htmlFor="smsCode" className="block text-sm font-normal text-gray-700" style={{ fontSize: '14px' }}>
                  Введите код подтверждения
                </label>
                <input
                  type="text"
                  name="smsCode"
                  id="smsCode"
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:bg-white"
                  placeholder="123 123"
                  required
                />
              </div>
              <button
                className="bg-grayth text-white py-2 px-4 rounded-md hover:bg-purple-950 mt-4 w-full"
                onClick={handleSmsSubmit}
                style={{ width: '100%', height: '50px' }}
              >
                Подтвердить
              </button>
            </div>
          )}
          {step === 3 && (
            <div className="text-center">
              <p className="text-green-600">Успешно!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderOther;
