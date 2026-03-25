const express = require("express");
const cors = require("cors");
const runCleanup = require("./cron/cleanupToken");
const errorMiddleware = require("./middlewares/errorMiddleware");
const authRoutes = require("./routes/authRoutes");

const app = express();

// global middleware
app.use(cors());
app.use(express.json());

// clean token
runCleanup();

// route
app.get("/", (req, res) => {
  res.json({
    message: "Barbershop API running",
  });
});

app.use("/api/auth", authRoutes);

// error handling
app.use(errorMiddleware);

module.exports = app;
