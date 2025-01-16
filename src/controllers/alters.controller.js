import { User } from "../models/user.model.js";
import redis from "redis";
import axios from "axios";
const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.connect();

const COINGECKO_API_URL = process.env.COINGECKO_API_URL;
const setAlert = async (req, res) => {
  const { crypto, threshold } = req.body;
  const { id, email } = req.user;

  if (!crypto || !threshold) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    // Save the user's alert in the database
    await User.findByIdAndUpdate(id, {
      alert: {
        crypto,
        threshold,
      },
    });
    res.status(201).json({ success: true, message: "Alert set successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error setting alert" });
  }
};

//fetching crypto prices
async function fetchCryptoPrices() {
  const cacheKey = "cryptoPrices"; // Key for the cached prices

  try {
    // Check if prices are already cached
    const cachedPrices = await redisClient.get(cacheKey);
    if (cachedPrices) {
      return JSON.parse(cachedPrices); // Return cached data
    }

    // If not cached, fetch from API
    const response = await axios.get(COINGECKO_API_URL, {
      params: {
        ids: "bitcoin,ethereum",
        vs_currencies: "usd",
      },
    });

    const prices = response.data;
    await redisClient.setEx(cacheKey, 60, JSON.stringify(prices)); // Cache data for 60 seconds
    return prices;
  } catch (error) {
    console.error("Error fetching prices:", error);
    return null;
  }
}

//checking for alerts
async function checkAlerts() {
  const prices = await fetchCryptoPrices();

  if (prices) {
    // Fetch all users with alerts
    const users = await User.find();

    users.forEach((user) => {
      const { crypto, threshold } = user.alert;
      const currentPrice = prices[crypto]?.usd;

      if (currentPrice >= threshold) {
        console.log(
          `Alert: ${crypto} has reached the threshold of ${threshold} USD for user ${user.email}`
        );
        // Send notification or email here
      }
    });
  }
}

const getAlerts = async (req, res) => {
  const { email, id } = req.user;
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("no user found");
    }

    res.json({
      success: true,
      data: {
        crypto: user.crypto,
        threshold: user.threshold,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export { checkAlerts, setAlert, getAlerts };
