import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import app from "./app.js";

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
