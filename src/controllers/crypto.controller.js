import axios from "axios";
import redis from "redis";

const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch((err) => console.error("Error connecting to Redis:", err));

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/coins/markets";
const cacheKey = "top10Cryptos";

// Fetch and update prices every minute
const fetchAndUpdatePrices = async () => {
  try {
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
    console.log("Top 10 cryptos updated in cache");
  } catch (error) {
    console.error("Error updating top 10 cryptos in cache:", error);
  }
};

// Run the fetchAndUpdatePrices function every 60 seconds
setInterval(fetchAndUpdatePrices, 60000); // 1 minute interval

// Initial fetch when the server starts
fetchAndUpdatePrices();

const getTop10 = async (req, res) => {
  const cacheKey = "top10Cryptos";

  try {
    // Get the data directly from Redis (which is updated every minute)
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("from redis");

      const cryptos = JSON.parse(cachedData);
      return res.json({
        success: true,
        cryptos,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Real-time data not available",
    });
  } catch (error) {
    console.error("Error fetching top 10 cryptos:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const getCrypto = async (req, res) => {
  const cryptoId = req.params.id;
  const cacheKey = `crypto_${cryptoId}`;

  try {
    // Get the cached data from Redis
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      // If data exists in cache, return it
      const crypto = JSON.parse(cachedData);
      return res.json({
        success: true,
        crypto,
      });
    }

    // If data is not available in cache, fetch it from CoinGecko API
    const response = await axios.get(COINGECKO_API_URL, {
      params: {
        ids: cryptoId,
        vs_currency: "usd",
      },
    });

    if (response.data && response.data.length > 0) {
      const cryptoDetails = response.data[0];

      // Cache the fetched data in Redis for 60 seconds
      await redisClient.setEx(cacheKey, 60, JSON.stringify(cryptoDetails));

      return res.json({
        success: true,
        crypto: cryptoDetails,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Cryptocurrency not found.",
      });
    }
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getTop10, getCrypto };
