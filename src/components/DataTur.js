import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const DataTur = () => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    cardBank: ''
  });
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/db/cardData');
      setDataList(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setDataList([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...formData };
      const response = await axios.post('/api/db/cardData', dataToSend);
      setDataList([...dataList, response.data]);
      setFormData({ cardNumber: '', cardName: '', cardBank: '' });
    } catch (err) {
      console.error('Error adding data:', err);
    }
  };

  const handleDelete = async (cardName) => {
    try {
      await axios.delete(`/api/db/cardData/name/${cardName}`);
      setDataList(dataList.filter(item => item.cardName !== cardName));
    } catch (err) {
      console.error('Error deleting data:', err);
    }
  };
  
  return (
    <div className="flex flex-col items-center p-4 bg-gray-fon min-h-screen">
      <div className="flex flex-col items-center space-y-4 h-full w-full md:max-w-[1070px] max-w-[390px]">
        <div className="bg-white p-4 rounded-lg w-full">
          <h2 className="text-lg font-semibold mb-4">Add New Data</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={formData.cardNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="cardName"
              placeholder="Card Name"
              value={formData.cardName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="cardBank"
              placeholder="Card Bank"
              value={formData.cardBank}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button type="submit" className="w-full py-2 bg-grayth text-white rounded-lg hover:bg-blue-600">
              Add Data
            </button>
          </form>
        </div>
        
        <div className="bg-white p-4 mt-4 rounded-lg w-full">
          <h2 className="text-lg font-semibold mb-4">Data List</h2>
          {dataList.length === 0 ? (
            <p className="text-gray-600">No data available</p>
          ) : (
            <ul className="space-y-2">
              {dataList.map((item) => (
                <li key={item._id} className="flex justify-between items-center p-4 bg-gray-form rounded-md shadow-sm">
                  <div>
                    <span className="font-medium">{item.cardNumber}</span> - <span>{item.cardName}</span> - <span>{item.cardBank}</span>
                  </div>
                  <button 
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={() => handleDelete(item.cardName)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTur;
