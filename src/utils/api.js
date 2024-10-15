import axios from 'axios';

const BASE_API_URL = '/api/external/auto/get_card/client/284278/amount';
const BASE_API_SBP = '/api/external/auto/get_card/client/399635/amount';

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
