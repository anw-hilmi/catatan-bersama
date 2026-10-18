import express from "express";
import { loginHandler } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginHandler);

export default router;
