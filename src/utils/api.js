import axios from 'axios';

const BASE_API_URL = '/api/external/auto/get_card/client/284278/amount';
const BASE_API_SBP = '/api/external/auto/get_card/client/399635/amount';
const API_BASE_URL = '/api2/card/request';

export const createOrder = async (amount) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/${amount}/currency/RUB/niche/auto`);
    return response.data[0];
  } catch (error) {
    console.error('Error creating payment request:', error);
    throw error;
  }
};

export const createOrderSPB = async (amount) => {
  try {
    const response = await axios.get(`${BASE_API_SBP}/${amount}/currency/RUB/niche/auto/bank/sbp`);
    return response.data[0];
  } catch (error) {
    console.error('Error creating payment request for SPB:', error);
    throw error;
  }
};

export const checkTradeStatus = async (order) => {
  try {
    const response = await axios.get(`/api/external/check_trade/trade/${order}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trade status:', error);
    throw error;
  }
};


export const createCardOrder = async (amount) => {
  const data = {
    api_key:  'c66eb87d0d2ecabff44fbe2ffe33f5c5b8decc45399e82d942eff802c6506fbe',
    amount: amount,
    merchant_order_id:  'optional',
    currency: 'RUB',
  };



  try {
    const response = await axios.post(`${API_BASE_URL}`, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data; // возвращаем объект с order_id, amount, card_number и статусом
  } catch (error) {
    console.error('Ошибка при создании заявки:', error);
    throw error;
  }
};
// Проверка статуса заявки
export const checkCardOrderStatus = async (orderId) => {
  const data = {
    api_key: '',
    order_id: orderId,
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/card/info/`, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data; // возвращаем статус заявки
  } catch (error) {
    console.error('Ошибка при проверке статуса заявки:', error);
    throw error;
  }
};
