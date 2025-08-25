// index.js
const express = require("express");
const cors = require("cors");
const { connectDB, sequelize } = require("./config/db");
require("dotenv").config();
const adminRoutes = require("./routes/authRoute");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", adminRoutes);
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Get port from environment or default to 4000
const PORT = process.env.PORT || 4000;

async function init() {
  try {
    // Connect to DB
    await connectDB();
    console.log("✅ Connected to MySQL database");

    // Sync Sequelize models
    await sequelize.sync();
    console.log("✅ Database synced");

    // Start Express server
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Express server started on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error starting server:", err);
    process.exit(1); // Exit the process on error
  }
}

init();
