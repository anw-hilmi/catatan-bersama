import express from "express";
import cors from "cors";
import routes from "../routes/index.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";

const createServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Tambahkan baris ini
  app.get("/", (req, res) => {
    res.send("Server berjalan!");
  });

  app.use("/api", routes);

  app.use(errorMiddleware);

  return app;
};

export default createServer;
