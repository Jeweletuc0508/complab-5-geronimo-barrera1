const express = require("express");
const amqp = require("amqplib");

const app = express();

app.use(express.json());

const BROKER_URL =
  process.env.BROKER_URL || "amqp://guest:guest@localhost:5672";

app.get("/", (req, res) => {
  res.json({
    service: "Order Service",
    status: "running"
  });
});

app.post("/orders", async (req, res) => {
  try {
    const connection = await amqp.connect(BROKER_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange("shop-events", "topic", {
      durable: true
    });

    const order = {
      orderId: Date.now(),
      product: req.body.product || "Laptop",
      quantity: req.body.quantity || 1
    };

    channel.publish(
      "shop-events",
      "order.placed",
      Buffer.from(JSON.stringify(order))
    );

    await channel.close();
    await connection.close();

    res.json({
      message: "Order placed",
      order
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to place order"
    });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Order Service running on port 3000");
});