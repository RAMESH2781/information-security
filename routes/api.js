const express = require('express');
const router = express.Router();
const axios = require('axios');
const ip = require('ip'); // To get the user's IP address
const { hash } = require('crypto');

const stockPriceAPI = 'https://stock-price-checker-proxy.freecodecamp.rocks/';

// Helper function to hash IP addresses
const hashIP = (ipAddress) => {
  return hash('sha256').update(ipAddress).digest('hex');
};

router.get('/stock-prices', async (req, res) => {
  const stock = req.query.stock;
  const like = req.query.like === 'true';

  if (!stock) return res.status(400).json({ error: 'Stock symbol is required' });

  let stocks = Array.isArray(stock) ? stock : [stock];
  let stockData = [];

  for (let sym of stocks) {
    try {
      const response = await axios.get(`${stockPriceAPI}?stock=${sym}`);
      let data = response.data;
      
      if (like) {
        // Add a like logic (one like per IP)
        const ipHash = hashIP(ip.address());
        // Save IP hash and handle likes in your database
        // For now, just simulate this
        data.stockData.likes += 1;
      }

      stockData.push(data.stockData);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching stock data' });
    }
  }

  if (stocks.length === 2) {
    // Calculate relative likes
    const [stock1, stock2] = stockData;
    stockData = [
      { ...stock1, rel_likes: stock1.likes - stock2.likes },
      { ...stock2, rel_likes: stock2.likes - stock1.likes }
    ];
  }

  res.json({ stockData });
});

module.exports = router;
