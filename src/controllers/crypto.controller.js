import axios from "axios";

import redisClient from "../config/redis.js";
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/coins/markets";

const getTop10 = async (req, res) => {
  const cacheKey = "top10Cryptos";
  console.log("gettop10");

  try {
    // Check if the data is cached in Redis
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      const cryptos = JSON.parse(cachedData);
      return res.json({
        success: true,
        cryptos,
      });
    }

    // If not cached, fetch from the API
    const response = await axios.get(COINGECKO_API_URL, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 10,
        page: 1,
      },
    });

    const cryptos = response.data;
    await redisClient.setEx(cacheKey, 60, JSON.stringify(cryptos)); // Cache for 60 seconds
    return res.json({
      success: true,
      cryptos,
    });
  } catch (error) {
    console.error("Error fetching top 10 cryptos:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// Fetch details for a specific cryptocurrency by its ID
const getCrypto = async (req, res) => {
  const cryptoId = req.params.id;
  const cacheKey = `crypto_${cryptoId}`;

  try {
    // Check cache first
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(cachedData);

      const crypto = JSON.parse(cachedData);
      return res.json({
        success: true,
        crypto,
      });
    }

    // If not cached, fetch from the API
    const response = await axios.get(`${COINGECKO_API_URL}`, {
      params: {
        ids: cryptoId,
        vs_currency: "usd",
      },
    });

    const cryptoDetails = response.data[0]; // Since we fetch by ID, it's a single item
    await redisClient.setEx(cacheKey, 60, JSON.stringify(cryptoDetails)); // Cache for 60 seconds
    const crypto = cryptoDetails;
    return res.json({
      success: true,
      crypto,
    });
  } catch (error) {
    console.error("Error fetching top 10 cryptos:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export { getTop10, getCrypto };
