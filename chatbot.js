const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());  // Enable CORS correctly

const emotionResponses = {
  fear: [
    "I sense fear. Don't worry, everything will be fine!",
    "Take a deep breath. Is there anything I can do to help?",
    "Facing fears can be tough, but you are strong! Want to talk about it?",
    "I understand that fear can be overwhelming. What exactly is making you feel this way?"
  ],
  sad: [
    "I'm here for you. Want to talk about it?",
    "It's okay to feel sad. I'm here to listen!",
    "Remember, you're not alone. What’s on your mind?",
    "Sometimes talking about your feelings helps. What’s troubling you?"
  ],
  happy: [
    "That's great to hear! Keep smiling! 😊",
    "Happiness looks good on you! What made your day?",
    "I'm happy to see you happy! Tell me more!",
    "It's always wonderful to see joy. What’s something that made you smile today?"
  ],
  disgust: [
    "Oh no! What happened?",
    "That doesn't sound good. Want to share more?",
    "I'm here to listen. What’s bothering you?",
    "It sounds like something is really upsetting you. Do you want to talk about it?"
  ],
  neutral: [
    "How can I assist you today?",
    "Hey there! Need any help?",
    "What's on your mind today?",
    "I’d love to chat! What’s something you’d like to talk about?"
  ],
};

app.post("/chat", (req, res) => {
  try {
    const { message, emotion } = req.body;
    
    if (!message || !emotion) {
      return res.status(400).json({ error: "Message and emotion are required!" });
    }

    console.log(`User Message: ${message} | Emotion Detected: ${emotion}`);

    let responses = emotionResponses[emotion] || ["I'm here to help!"];

    if (emotion === "sad" || emotion === "fear" || emotion === "disgust") {
      responses.push("Would you like some advice or just someone to listen?");
      responses.push("It's okay to feel this way. Do you want to talk about what’s causing this feeling?");
    }

    const reply = responses[Math.floor(Math.random() * responses.length)];
    res.json({ reply });
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
