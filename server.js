const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.post('/predict', (req, res) => {
    const { input } = req.body;
    // Process the input and return a prediction (dummy response for now)
    res.json({ prediction: "Sample Prediction Output" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    const express = require("express");
const cors = require("cors");
});
