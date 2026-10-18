import express from "express";
import * as controller from "../controllers/acaraController.js";

const router = express.Router();

router.get("/", controller.getAllHandler);
router.post("/", controller.createHandler);
router.put("/:id", controller.updateHandler);
router.delete("/:id", controller.deleteHandler);

export default router;
