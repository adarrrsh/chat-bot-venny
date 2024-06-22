import React, { useState } from "react";
import "./Chat.css";
import axios from "axios";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessage = async () => {
    if (message.trim() !== "") {
      const newChatLog = [
        ...chatLog,
        { author: "You", content: message, id: Date.now() },
      ];
      setChatLog(newChatLog);
      setMessage("");
      setIsLoading(true);

      try {
        const response = await axios.post(
          "http://localhost:8000/chat",
          { message, history: newChatLog },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 200) {
          const responseData = response.data;

          if (
            responseData &&
            responseData.choices &&
            responseData.choices.length > 0
          ) {
            const assistantResponse = responseData.choices[0].message.content;
            animateResponse(assistantResponse);
          } else {
            console.error(
              "Invalid response format from backend:",
              responseData
            );
          }
        } else {
          console.error("Error sending message:", response.statusText);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const animateResponse = (responseContent) => {
    const words = responseContent.split(" ");
    let animatedResponse = "";
    let index = 0;

    const intervalId = setInterval(() => {
      if (index < words.length) {
        animatedResponse += words[index] + " ";
        setChatLog((prevLog) => {
          const updatedLog = [...prevLog];
          if (
            updatedLog.length === 0 ||
            updatedLog[updatedLog.length - 1].author !== "Bot"
          ) {
            updatedLog.push({ author: "Bot", content: "", id: Date.now() });
          }
          updatedLog[updatedLog.length - 1].content = animatedResponse.trim();
          return updatedLog;
        });
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 200); // Adjust animation speed here (milliseconds per word)
  };

  return (
    <div className="chat-container">
      <h1>LLM Chat</h1>
      <div className="chat-log">
        {chatLog.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${
              msg.author === "You" ? "right" : "left"
            }`}
          >
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {isLoading && <div className="loader">Loading...</div>}
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
