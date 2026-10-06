const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    service: "Inventory Service",
    status: "running"
  });
});

app.get("/inventory", (req, res) => {
  res.json({
    products: [
      {
        id: 1,
        name: "Laptop",
        stock: 10
      },
      {
        id: 2,
        name: "Mouse",
        stock: 20
      }
    ]
  });
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Inventory Service running on port 3000");
});
