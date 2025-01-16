import exp from "constants";
import express from "express";
import {
  getAlerts,
  setAlert,
  testingMail,
} from "../controllers/alters.controller.js";
import checkAuth from "../middleware/authProtect.js";

const alertsRoutes = express.Router();

alertsRoutes.get("/", checkAuth, getAlerts);

alertsRoutes.post("/set", checkAuth, setAlert);

alertsRoutes.get("/test-mail", testingMail);

export default alertsRoutes;
