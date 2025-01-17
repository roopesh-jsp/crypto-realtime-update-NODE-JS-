# Cryptocurrency Price Monitoring and Alerting System

## Overview

This project is a real-time cryptocurrency price monitoring system built using **Node.js**, **Express.js**, **MongoDB**, **Redis**, and the **CoinGecko API**. The system fetches cryptocurrency prices, caches them using Redis, and allows users to set alerts when the price of a cryptocurrency reaches a certain threshold. The alerts are sent via email using **Nodemailer**.

## Features

- **Real-time cryptocurrency price monitoring**: Fetches the latest prices for the top 10 cryptocurrencies and individual cryptocurrencies.
- **Caching with Redis**: Prices are cached for efficiency and reduced API calls.
- **User-specific alerts**: Users can set alerts for specific cryptocurrencies when their prices reach a threshold.
- **Email notifications**: Sends email notifications when the alert conditions are met.
- **Automatic price updates**: Cryptocurrency prices are updated in the cache every minute.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Caching**: Redis
- **API**: CoinGecko API
- **Email Notifications**: Nodemailer
- **Authentication**: JWT-based authentication
- **Environment**: Dotenv for environment variable management

## Setup and Installation

### Prerequisites

- Node.js and npm (Node Package Manager)
- Redis server
- MongoDB Atlas account (or a local MongoDB instance)
- Email account for sending alerts (e.g., Gmail)

### .env file
- COINGECKO_API_URL=https://api.coingecko.com/api/v3/coins/markets
- MONGO_URL=mongodb+srv://<your_mongo_credentials>@cluster0.mongodb.net/crypto
- REDIS_URL=redis://localhost:6379
- PORT=3000
- JWT_SECRET="your_jwt_secret"
- EMAIL_USER="your_email@example.com"
- EMAIL_PASS="your_email_password"



  
