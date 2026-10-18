import express from "express";
import peraturanRoute from "../services/peraturan/route/index.js";
import tugasUtamaRoute from "../services/tugasUtama/route/index.js";
import tugasHarianRoute from "../services/tugasHarian/route/index.js";
import acaraRoute from "../services/acara/route/index.js";
import doaRoute from "../services/doa/route/index.js";
import adminRoute from "../services/admin/route/index.js";
import authRoute from "../services/auth/route/index.js";

const router = express.Router();

router.use("/peraturan", peraturanRoute);
router.use("/tugas-utama", tugasUtamaRoute);
router.use("/tugas-harian", tugasHarianRoute);
router.use("/acara", acaraRoute);
router.use("/doa", doaRoute);
router.use("/admin", adminRoute);
router.use("/auth", authRoute);
router.get("/", (req, res) => {
  res.send("API Catatan Bersama berjalan!");
});
export default router;
