const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

let aboutData = {
  title: "About TeachMood",
  description: "Empowering educators with AI-driven insights into student engagement.",
  challenge: {
    title: "The Challenge",
    content:
      "Teachers often struggle to identify disengaged or confused students in online classes. The lack of non-verbal cues makes it difficult to assess students’ emotional state in real-time.",
  },
  solution: {
    title: "Our Solution",
    content:
      "TeachMood utilizes AI-powered facial expression analysis to track student engagement levels. By analyzing emotions in real-time, teachers gain valuable insights into student attentiveness.",
  },
  howItWorks: {
    title: "How It Works",
    points: [
      "Uses Deep Learning models (TensorFlow, OpenCV, YOLO) to detect emotions.",
      "Live webcam analysis to track student expressions in online classes.",
      "Provides visual insights (e.g., attentive, confused, distracted) to teachers.",
    ],
  },
  futureScope: {
    title: "Future Scope",
    points: [
      "Emotion-based adaptive learning systems.",
      "AI-generated real-time feedback for improving student engagement.",
      "Potential integration with LMS platforms for better analytics.",
    ],
  },
  team: {
    title: "Built by Team AlgoRiders",
    content: "An innovation-driven team from SRMIST.",
  },
};


app.get("/api/about", (req, res) => {
  res.json(aboutData);
});


app.post("/api/about", (req, res) => {
  aboutData = req.body; // Replace the entire data
  res.json({ message: "About page updated successfully!", aboutData });
});


app.put("/api/about/:section", (req, res) => {
  const section = req.params.section;
  if (aboutData[section]) {
    aboutData[section] = { ...aboutData[section], ...req.body };
    res.json({ message: `Section '${section}' updated successfully!`, aboutData });
  } else {
    res.status(404).json({ error: "Section not found!" });
  }
});


app.delete("/api/about/:section", (req, res) => {
  const section = req.params.section;
  if (aboutData[section]) {
    delete aboutData[section];
    res.json({ message: `Section '${section}' deleted successfully!`, aboutData });
  } else {
    res.status(404).json({ error: "Section not found!" });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
