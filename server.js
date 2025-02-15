const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3001;

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Current weather endpoint
app.get('/api/weather/current', async (req, res) => {
  try {
    const { city, units } = req.query;
    const apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${process.env.API_KEY}&units=${units}`;
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching weather data' });
  }
});

// Forecast endpoint
app.get('/api/weather/forecast', async (req, res) => {
  try {
    const { city, units } = req.query;
    const apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${process.env.API_KEY}&units=${units}`;
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching forecast data' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
