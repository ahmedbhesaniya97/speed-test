const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = Number(process.env.PORT) ?? 3000;

const genContent = (numBytes = 0) => "0".repeat(Math.max(0, numBytes));

app.use(cors());
app.use(morgan("tiny"));

app.get("/test-download-speed", (request, res) => {
  const reqTime = new Date();
  const { bytes } = request.query;
  const numBytes = bytes ?? 300000;
  console.log(numBytes);

  res.set("access-control-allow-origin", "*");
  res.set("timing-allow-origin", "*");
  res.set("cache-control", "no-store");
  res.set("content-type", "application/octet-stream");

  request.cf && request.cf.colo && res.set("cf-meta-colo", request.cf.colo);

  res.set("cf-meta-request-time", +reqTime);

  res.set(
    "access-control-expose-headers",
    "cf-meta-colo, cf-meta-request-time"
  );

  res.send(genContent(numBytes));
});

app.post("/test-upload-speed", (request, res) => {
  const reqTime = new Date();

  res.set("access-control-allow-origin", "*");
  res.set("timing-allow-origin", "*");

  request.cf && request.cf.colo && res.set("cf-meta-colo", request.cf.colo);

  res.set("cf-meta-request-time", +reqTime);

  res.set(
    "access-control-expose-headers",
    "cf-meta-colo, cf-meta-request-time"
  );
  res.send("ok");
});

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});
