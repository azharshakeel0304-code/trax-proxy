const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

const SONIC_BASE = "https://sonic.pk/api/v1";
const API_KEY = "dk9tWVN1dUhqNHVhSmpQZFVBTXk2U2xNZFFHb2xQSjlWbmsxWU4wZGFpcnlFMENhSDNGU2VHVVRGWTVT68724dd449355";

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Classic Ceramics Trax Proxy is running ✅" });
});

// Proxy ALL requests to Sonic API
app.all("/api/*", async (req, res) => {
  const sonicPath = req.path.replace("/api", "");
  const sonicUrl = ${SONIC_BASE}${sonicPath}${req.url.includes("?") ? "?" + req.url.split("?")[1] : ""};

  try {
    const options = {
      method: req.method,
      headers: {
        "Authorization": API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    };

    if (["POST", "PUT", "PATCH"].includes(req.method) && req.body) {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(sonicUrl, options);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message, proxy: "Classic Ceramics Trax Proxy" });
  }
});

app.listen(PORT, () => {
  console.log(✅ Trax Proxy running on port ${PORT});
});
