const express = require("express");
const amqp = require("amqplib");

const app = express();

app.use(express.json());

const BROKER_URL =
  process.env.BROKER_URL || "amqp://guest:guest@localhost:5672";

app.get("/", (req, res) => {
  res.json({
    service: "Payment Service",
    status: "running"
  });
});

app.post("/payments", async (req, res) => {
  try {
    const connection = await amqp.connect(BROKER_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange("shop-events", "topic", {
      durable: true
    });

    const payment = {
      paymentId: Date.now(),
      orderId: req.body.orderId,
      status: "success"
    };

    channel.publish(
      "shop-events",
      "payment.success",
      Buffer.from(JSON.stringify(payment))
    );

    await channel.close();
    await connection.close();

    res.json({
      message: "Payment successful",
      payment
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Payment failed"
    });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Payment Service running on port 3000");
});