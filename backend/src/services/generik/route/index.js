import express from "express";
import { createRepository } from "../repositories/baseRepository.js";
import { createController } from "../controllers/baseController.js";

export const createNoteRouter = (tableName) => {
  const router = express.Router();
  const repo = createRepository(tableName);
  const controller = createController(repo);

  router.get("/", controller.getAllHandler);
  router.post("/", controller.createHandler);
  router.put("/:id", controller.updateHandler);
  router.delete("/:id", controller.deleteHandler);

  return router;
};
