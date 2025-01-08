const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = Number(process.env.PORT) ?? 3000;

const genContent = (numBytes = 0) => "0".repeat(Math.max(0, numBytes));

// Define CORS options
const corsOptions = {
  origin: true, // Reflects the request origin
  methods: ['GET', 'POST', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'cf-meta-colo', 'cf-meta-request-time'],
  exposedHeaders: ['cf-meta-colo', 'cf-meta-request-time'],
  credentials: true,
  maxAge: 86400 // How long the results of a preflight request can be cached
};

// Apply CORS middleware with options
app.use(cors(corsOptions));
app.use(morgan("tiny"));

app.get("/test-download-speed", (request, res) => {
  const reqTime = new Date();
  const { bytes } = request.query;
  const numBytes = bytes ?? 300000;
  console.log(numBytes);

  res.set("cache-control", "no-store");
  res.set("content-type", "application/octet-stream");

  if (request.cf && request.cf.colo) {
    res.set("cf-meta-colo", request.cf.colo);
  }

  res.set("cf-meta-request-time", +reqTime);
  res.send(genContent(numBytes));
});

app.use(express.raw({ type: '*/*', limit: '50mb' }));

app.post("/test-upload-speed", (request, res) => {
  const reqTime = new Date();

  if (request.cf && request.cf.colo) {
    res.set("cf-meta-colo", request.cf.colo);
  }

  res.set("cf-meta-request-time", +reqTime);
  res.send("ok");
});

// Handle OPTIONS requests explicitly
app.options('*', cors(corsOptions));

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});