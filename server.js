var express = require("express");
var cors = require("cors");
var https = require("https");

var app = express();
var PORT = process.env.PORT || 3000;
var API_KEY = "dk9tWVN1dUhqNHVhSmpQZFVBTXk2U2xNZFFHb2xQSjlWbmsxWU4wZGFpcnlFMENhSDNGU2VHVVRGWTVT68724dd449355";
var SONIC_BASE = "https://sonic.pk/api/v1";

app.use(cors());
app.use(express.json());

app.get("/", function(req, res) {
  res.json({ status: "Classic Ceramics Trax Proxy is running" });
});

app.all("/api/*", function(req, res) {
  var path = req.path.replace("/api", "");
  var query = req.url.indexOf("?") !== -1 ? "?" + req.url.split("?")[1] : "";
  var targetUrl = SONIC_BASE + path + query;

  var parsed = require("url").parse(targetUrl);
  var body = JSON.stringify(req.body);

  var options = {
    hostname: parsed.hostname,
    port: 443,
    path: parsed.path,
    method: req.method,
    headers: {
      "Authorization": API_KEY,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Content-Length": Buffer.byteLength(body)
    }
  };

  var request = https.request(options, function(response) {
    var data = "";
    response.on("data", function(chunk) { data += chunk; });
    response.on("end", function() {
      try {
        res.status(response.statusCode).json(JSON.parse(data));
      } catch(e) {
        res.status(response.statusCode).send(data);
      }
    });
  });

  request.on("error", function(err) {
    res.status(500).json({ error: err.message });
  });

  if (["POST", "PUT", "PATCH"].indexOf(req.method) !== -1) {
    request.write(body);
  }

  request.end();
});

app.listen(PORT, function() {
  console.log("Trax Proxy running on port " + PORT);
});
