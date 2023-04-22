import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router();

//redirect /auth for the index.js file for /login, -> /auth/login
//call the controller of login
router.post("/login", login);

export default router; 