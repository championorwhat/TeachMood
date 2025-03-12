const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

let isLive = false;
let startTime = null;
let viewers = 0;


const getLiveDuration = () => {
  if (!isLive || !startTime) return 0;
  return Math.floor((Date.now() - startTime) / 1000); 
};


const updateViewers = () => {
  if (isLive) viewers += Math.floor(Math.random() * 5) + 1; 
};


app.post("/start", (req, res) => {
  isLive = true;
  startTime = Date.now();
  viewers = Math.floor(Math.random() * 10) + 5; 
  res.json({ message: "Live stream started", isLive });
});


app.post("/stop", (req, res) => {
  isLive = false;
  startTime = null;
  res.json({ message: "Live stream stopped", isLive });
});


app.get("/status", (req, res) => {
  updateViewers();
  res.json({ isLive, duration: getLiveDuration(), viewers });
});


app.post("/reset", (req, res) => {
  isLive = false;
  startTime = null;
  viewers = 0;
  res.json({ message: "Live session reset", isLive, viewers });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
