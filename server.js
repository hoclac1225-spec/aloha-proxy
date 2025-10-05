// src/server.js
import express from "express";
import "../lib/shopify-init.js"; // phải import đầu tiên

import { createShopifyCustomer } from "../app/lib/shopify.js";

const app = express();

app.get("/", (req, res) => res.send("Shopify server running ✅"));

app.get("/test-customer", async (req, res) => {
  try {
    const customer = await createShopifyCustomer({
      name: "Test User",
      email: "test@example.com",
      phone: "0123456789",
    });
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[server] Listening on port ${PORT}`);
});
