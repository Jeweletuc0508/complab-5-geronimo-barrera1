const express = require("express");
const amqp = require("amqplib");

const app = express();

app.use(express.json());

const BROKER_URL =
  process.env.BROKER_URL || "amqp://guest:guest@localhost:5672";

app.get("/", (req, res) => {
  res.json({
    service: "Notification Service",
    status: "running"
  });
});

async function startConsumer() {
  try {
    const connection = await amqp.connect(BROKER_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange("shop-events", "topic", {
      durable: true
    });

    const queue = await channel.assertQueue("notification-queue", {
      durable: true
    });

    await channel.bindQueue(
      queue.queue,
      "shop-events",
      "order.placed"
    );

    await channel.bindQueue(
      queue.queue,
      "shop-events",
      "payment.success"
    );

    channel.consume(queue.queue, (message) => {
      if (message) {
        const event = JSON.parse(message.content.toString());

        console.log("Notification received:", event);

        channel.ack(message);
      }
    });

    console.log("Notification Service connected to RabbitMQ");
  } catch (error) {
    console.error("RabbitMQ connection failed:", error.message);
  }
}

app.listen(3000, "0.0.0.0", () => {
  console.log("Notification Service running on port 3000");
  startConsumer();
});