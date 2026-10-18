import dotenv from "dotenv";
import createServer from "./src/server/index.js";

dotenv.config();

const app = createServer();
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server berjalan di port ${PORT}`);
});

export default app;
