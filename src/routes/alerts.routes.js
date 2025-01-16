import exp from "constants";
import express from "express";
import { getAlerts, setAlert } from "../controllers/alters.controller.js";
import checkAuth from "../middleware/authProtect.js";

const alertsRoutes = express.Router();

alertsRoutes.get("/", checkAuth, getAlerts);

alertsRoutes.post("/set", checkAuth, setAlert);

export default alertsRoutes;
