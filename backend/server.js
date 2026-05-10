import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start the API only after MongoDB is connected.
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Traveloop backend running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  });
