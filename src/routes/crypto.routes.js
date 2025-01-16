import express from "express";
import { getCrypto, getTop10 } from "../controllers/crypto.controller.js";

const cryptoRoutes = express.Router();

cryptoRoutes.get("/top10", getTop10);

cryptoRoutes.get("/:id", getCrypto);

export default cryptoRoutes;
