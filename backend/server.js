import dotenv from "dotenv";
import createServer from "./src/server/index.js";

dotenv.config();

const app = createServer();

app.get("/", (req, res) => {
  res.send("Server berjalan!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server berjalan di port ${PORT}`);
});
