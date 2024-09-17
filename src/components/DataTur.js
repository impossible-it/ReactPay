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
      const response = await axios.get('/api/userData');
      setDataList(response.data);
    } catch (err) {
      console.error(err);
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
      const response = await axios.post('/api/userData', formData);
      setDataList([...dataList, response.data]);
      setFormData({ cardNumber: '', cardName: '', cardBank: '' });
    } catch (err) {
      console.error(err);
    }
  };

  // Function to delete an item from the server and update the state
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/userData/${id}`);
      setDataList(dataList.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Add New Data</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="cardNumber"
          placeholder="Card Number"
          value={formData.cardNumber}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cardName"
          placeholder="Card Name"
          value={formData.cardName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="cardBank"
          placeholder="Card Bank"
          value={formData.cardBank}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Data</button>
      </form>

      <h2>Data List</h2>
      <ul>
        {dataList.map((item) => (
          <li key={item._id}>
            {item.cardNumber} - {item.cardName} - {item.cardBank}
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataTur;
