const express = require("express");
const bodyParser = require("body-parser");
const Redis = require("ioredis");
const redis = new Redis({ host: process.env.REDIS_HOST || "redis", port: process.env.REDIS_PORT || 6379 });

const app = express();
app.use(bodyParser.json());

app.post("/jobs", async (req, res) => {
  const job = { id: Date.now(), created_at: new Date().toISOString(), ...req.body };
  await redis.lpush("print:queue", JSON.stringify(job));
  console.log("print job queued", job);
  res.status(202).json({ status: "queued", job });
});

app.post("/jobs/process", async (req, res) => {
  const raw = await redis.rpop("print:queue");
  if (!raw) return res.status(200).json({ processed: 0 });
  const job = JSON.parse(raw);
  console.log("processing job", job);
  await redis.lpush("print:history", JSON.stringify({ ...job, processed_at: new Date().toISOString() }));
  res.json({ processed: 1, job });
});

const PORT = process.env.PRINT_AGENT_PORT || 8010;
app.listen(PORT, () => console.log(`Print-agent listening ${PORT}`));

