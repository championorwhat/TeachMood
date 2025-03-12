import React, { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [emotion, setEmotion] = useState("neutral");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const getEmotionIcon = (emotion) => {
    switch (emotion) {
      case "happy": return "😊";
      case "sad": return "😢";
      case "fear": return "😨";
      case "disgust": return "🤢";
      default: return "😐";
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const newChat = [...chat, { user: "You", text: message, emotion }];
    setChat(newChat);
    setMessage("");
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          emotion,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setChat([...newChat, { user: "Bot", text: data.reply }]);
    } catch (error) {
      console.error("Error communicating with chatbot", error);
      setChat([...newChat, { user: "Bot", text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-indigo-600 text-white p-4 flex items-center">
        <span className="text-xl mr-2">🤖</span>
        <h2 className="text-xl font-bold">Emotion Chatbot</h2>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {chat.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Start a conversation!</p>
            <p className="text-sm mt-2">Your chatbot responds based on the selected emotion</p>
          </div>
        ) : (
          chat.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-4 max-w-xs rounded-lg p-3 ${
                msg.user === "You" 
                  ? "ml-auto bg-indigo-500 text-white rounded-br-none" 
                  : "mr-auto bg-white shadow rounded-bl-none"
              }`}
            >
              <div className="flex items-center mb-1">
                <span className="font-bold text-sm">{msg.user}</span>
                {msg.emotion && (
                  <span className="ml-2">{getEmotionIcon(msg.emotion)}</span>
                )}
              </div>
              <div>{msg.text}</div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="mr-auto bg-white shadow rounded-lg rounded-bl-none p-3 max-w-xs">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center mb-2">
          <label className="text-sm text-gray-600 mr-2">Bot's mood:</label>
          <select 
            value={emotion} 
            onChange={(e) => setEmotion(e.target.value)}
            className="bg-gray-100 border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="neutral">Neutral 😐</option>
            <option value="happy">Happy 😊</option>
            <option value="sad">Sad 😢</option>
            <option value="fear">Fear 😨</option>
            <option value="disgust">Disgust 🤢</option>
          </select>
        </div>
        
        <div className="flex">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={sendMessage}
            disabled={isLoading || !message.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;