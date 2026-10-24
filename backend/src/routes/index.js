import express from "express";
import { createNoteRouter } from "../services/generik/route/index.js";
import adminRoute from "../services/admin/route/index.js";
import authRoute from "../services/auth/route/index.js";

const router = express.Router();

// Route Generik (Memakai Factory Pattern)
router.use("/peraturan", createNoteRouter("peraturan"));
router.use("/tugas-utama", createNoteRouter("tugas_utama"));
router.use("/tugas-harian", createNoteRouter("tugas_harian"));
router.use("/acara", createNoteRouter("acara"));
router.use("/doa", createNoteRouter("doa"));

// Route Khusus (Fitur Spesifik)
router.use("/admin", adminRoute);
router.use("/auth", authRoute);

router.get("/", (req, res) => {
  res.send("API Catatan Bersama berjalan!");
});

export default router;
