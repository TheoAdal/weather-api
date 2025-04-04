import express from "express";
import dotenv from "dotenv";
import apiRoutes from "./src/api.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/test", (_req, res) => {
    res.send("<h1>Dont mind me, just checking in :)</h1>");
  });