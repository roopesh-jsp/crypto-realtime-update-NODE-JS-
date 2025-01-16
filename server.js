import express from "express";
import cryptoRoutes from "./src/routes/crypto.routes.js";
import { connectDb } from "./src/config/db.js";
import dotenv from "dotenv";
import userRoutes from "./src/routes/user.routes.js";
import { checkAlerts } from "./src/controllers/alters.controller.js";
import alertsRoutes from "./src/routes/alerts.routes.js";

//config
const app = express();
dotenv.config();
app.use(express.json());
//MIDDLEWARE

//routes
app.use("/api/crypto", cryptoRoutes);

app.use("/api/user", userRoutes);

app.use("/api/alerts", alertsRoutes);

setInterval(() => {
  checkAlerts();
}, 60000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDb();
  console.log(`server running on ${PORT}`);
});
