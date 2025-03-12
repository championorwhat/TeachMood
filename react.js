import { useState } from "react";

const App = () => {
  const [result, setResult] = useState(null);

  const sendDataToBackend = async () => {
    const response = await fetch("http://localhost:3000/analyze-emotion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: [0.1, 0.2, 0.3] }) 
    });

    const data = await response.json();
    setResult(data.prediction);
  };

  return (
    <div>
      <button onClick={sendDataToBackend}>Analyze Emotion</button>
      {result && <p>Prediction: {result}</p>}
    </div>
  );
};

export default App;
