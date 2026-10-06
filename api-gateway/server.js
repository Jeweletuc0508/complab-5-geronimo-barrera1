const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000"
  })
);

const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://localhost:3000";

app.get("/", (req, res) => {
  res.json({
    service: "API Gateway",
    status: "running"
  });
});

app.post("/orders", async (req, res) => {
  try {
    const response = await axios.post(
      `${ORDER_SERVICE_URL}/orders`,
      req.body
    );

    res.json(response.data);
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      error: "Failed to communicate with Order Service"
    });
  }
});

app.listen(8080, "0.0.0.0", () => {
  console.log("API Gateway running on port 8080");
});