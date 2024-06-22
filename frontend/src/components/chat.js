import React, { useState } from "react";
import "./Chat.css";
import axios from "axios";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessage = async () => {
    if (message.trim() !== "") {
      setChatLog((prevLog) => [...prevLog, `You: ${message}`]);

      try {
        const response = await axios.post(
          "http://localhost:8000/chat",
          { message },
          { headers: { "Content-Type": "application/json" } }
        );

        // Logging the entire response object for debugging
        console.log("Response received from backend:", response);

        // Assuming response.data contains the expected structure
        if (
          response.data &&
          response.data.choices &&
          response.data.choices.length > 0 &&
          response.data.choices[0].message &&
          response.data.choices[0].message.content
        ) {
          setChatLog((prevLog) => [
            ...prevLog,
            `Assistant: ${response.data.choices[0].message.content}`,
          ]);
        } else {
          console.error("Invalid response format from backend");
        }

        setMessage(""); // Clear message input after sending
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="chat-container">
      <h1>LLM Chat</h1>
      <div className="chat-log">
        {chatLog.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <div className="chat-input">
        <textarea
          rows="4"
          cols="50"
          value={message}
          onChange={handleChange}
          placeholder="Type your message here..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
