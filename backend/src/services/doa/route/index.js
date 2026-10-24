import express from "express";
import multer from "multer";
import * as controller from "../controllers/doaController.js";

const router = express.Router();
// Simpan file sementara di memori untuk diupload ke Supabase
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", controller.getAllHandler);
// 'pdf' adalah nama field di form-data postman/frontend
router.post("/", upload.array("pdfFiles", 10), controller.createHandler);
router.put("/:id", upload.array("pdfFiles", 10), controller.updateHandler);
router.delete("/:id", controller.deleteHandler);

export default router;
