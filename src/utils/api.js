import axios from 'axios';

const BASE_API_URL = '/api/auto/get_card/client/284278/amount';

export const createOrder = async (amount) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/${amount}/currency/RUB/niche/kot`);
    return response.data[0];
  } catch (error) {
    console.error('Error creating payment request:', error);
    throw error;
  }
};

export const createOrderSPB = async (amount) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/${amount}/currency/RUB/niche/kot/bank/spb`);
    return response.data[0];
  } catch (error) {
    console.error('Error creating payment request for SPB:', error);
    throw error;
  }
};
