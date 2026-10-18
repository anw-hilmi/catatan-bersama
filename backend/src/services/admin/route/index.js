import express from "express";
import {
  getAllCredentialsHandler,
  updateCredentialHandler,
} from "../controllers/adminController.js";
import authMiddleware from "../../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/credentials", getAllCredentialsHandler);
router.put("/credentials", updateCredentialHandler);

export default router;
