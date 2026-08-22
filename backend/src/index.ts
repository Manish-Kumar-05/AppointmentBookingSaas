import "dotenv/config";

import app from "./app.js";
import "./workers/email.worker.js";
import "./workers/meeting.worker.js";

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Email and Meeting workers started");
});
