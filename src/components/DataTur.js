import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataTur = () => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    cardBank: ''
  });
  const [dataList, setDataList] = useState([]);

  // Fetch all data from the server when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch all data from the server
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/db/cardData');
      // Ensure response.data is an array
      setDataList(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setDataList([]); // Set an empty array in case of error
    }
  };

  // Function to handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
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

  // Function to delete an item from the server and update the state
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/db/cardData/${id}`);
      setDataList(dataList.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error deleting data:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Add New Data</h2>
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
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Add Data
        </button>
      </form>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Data List</h2>
      {dataList.length === 0 ? (
        <p className="text-gray-600">No data available</p>
      ) : (
        <ul className="space-y-2">
          {dataList.map((item) => (
            <li key={item._id} className="flex justify-between items-center p-4 bg-white rounded-md shadow-sm">
              <div>
                <span className="font-medium">{item.cardNumber}</span> - <span>{item.cardName}</span> - <span>{item.cardBank}</span>
              </div>
              <button 
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DataTur;
