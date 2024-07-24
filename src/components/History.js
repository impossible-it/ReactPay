import React, { useState, useEffect } from 'react';
import axios from 'axios';

const History = ({ userId }) => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [history, setHistory] = useState([]);

  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/history/${userId}`);
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 ">
      {/* Баланс */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-400 p-6 rounded-lg shadow-md mb-6 flex flex-col md:flex-row justify-between items-center text-white">
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h2 className="text-3xl font-bold">Баланс</h2>
          <p className="text-4xl font-semibold mt-2">5000 UAH</p>
        </div>
        <div className="flex flex-col md:flex-row items-center">
          <input
            type="text"
            placeholder="USDT-TRC20"
            className="w-full bg-grayth md:w-auto px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purpleth text-purpleth md:mr-4"
          />
          <button className="bg-grayth text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 mt-2 md:mt-0">
            Withdraw
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4">Мої заявки</h1>
      <button
        onClick={toggleFilters}
        className="bg-blue-600 text-white py-2 px-4 rounded-md mb-4 hover:bg-blue-700 transition duration-300"
      >
        {filtersVisible ? 'Сховати фільтри' : 'Показати фільтри'}
      </button>

      {filtersVisible && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <h2 className="text-xl font-bold mb-2">Фільтри</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-700">Дата</label>
              <input type="date" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
            <div>
              <label className="block text-gray-700">Статус</label>
              <select className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
                <option value="">Усі</option>
                <option value="success">Успішно</option>
                <option value="pending">Очікування</option>
                <option value="failed">Невдала</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-normal text-gray-500 uppercase tracking-wider">Дата</th>
                <th className="px-6 py-3 text-left text-xs font-normal text-gray-500 uppercase tracking-wider">Время</th>
                <th className="px-6 py-3 text-left text-xs font-normal text-gray-500 uppercase tracking-wider">Сума</th>
                <th className="px-6 py-3 text-left text-xs font-normal text-gray-500 uppercase tracking-wider">Сума с НДС</th>
                <th className="px-6 py-3 text-left text-xs font-normal text-gray-500 uppercase tracking-wider">Статус заявки</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.amount} UAH</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.amountWithTax} UAH</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Успішно' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Кнопки пагінації */}
        <div className="flex justify-end mt-4">
          <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 mr-2">Попередня</button>
          <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">Наступна</button>
        </div>
      </div>
    </div>
  );
};

export default History;
