import express from "express";
import { loginUser, userRegister } from "../controllers/user.controller.js";

const userRoutes = express.Router();

userRoutes.post("/login", loginUser);

userRoutes.post("/register", userRegister);

export default userRoutes;
