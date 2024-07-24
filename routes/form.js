const express = require('express');
const router = express.Router();
const FormData = require('../models/FormData'); // Import the FormData model

// @route    POST api/form
// @desc     Create a new form entry
// @access   Public
router.post('/', async (req, res) => {
  const { name, phoneNumber, amount, clientNumber } = req.body;

  // Validate incoming data
  if (!name || !phoneNumber || !amount) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const formData = new FormData({
      name,
      phoneNumber,
      amount,
      clientNumber: clientNumber || undefined // Handle empty clientNumber
    });

    await formData.save();
    res.json(formData);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/form/:id
// @desc     Get form data by ID
// @access   Public
router.get('/:id', async (req, res) => {
  try {
    const formData = await FormData.findById(req.params.id);

    if (!formData) {
      return res.status(404).json({ msg: 'Form data not found' });
    }

    res.json(formData);
  } catch (err) {
    console.error('Error:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Form data not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;
