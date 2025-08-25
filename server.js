const express = require("express");
const cors = require("cors");
const { connectDB, sequelize } = require("./config/db");
require("dotenv").config();
const adminRoutes = require("./routes/authRoute");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", adminRoutes);
app.get("/", (req, res) => {
  res.send("Server is running!");
});

const PORT = 4005;

async function init() {
  try {
    await connectDB();
    console.log("✅ Connected to MySQL database");

    await sequelize.sync();
    console.log("✅ Database synced");

    app.listen(PORT, () => {
      console.log(` Express server started on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
  }
}

init();
