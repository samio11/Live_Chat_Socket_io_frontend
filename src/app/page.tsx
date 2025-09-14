"use client";

import { useEffect, useState } from "react";
import socket from "@/utils/socket";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Listen for incoming messages
    socket.on("newMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // ✅ Listen for disconnect notifications
    socket.on("userDisconnected", (data) => {
      setMessages((prev) => [...prev, { user: "System", text: data.message }]);
    });

    return () => {
      socket.off("newMessage");
      socket.off("userDisconnected");
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !username.trim()) return;

    const messageData = { user: username, text: input };
    socket.emit("sendMessage", messageData);
    setInput("");
  };

  console.log(process.env.NEXT_PUBLIC_BACKEND);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-4">
        <h1 className="text-2xl font-bold text-center mb-4">💬 Live Chat</h1>

        {/* Username Input */}
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        {/* Chat Box */}
        <div className="h-64 overflow-y-auto border rounded p-2 mb-3 bg-gray-50">
          {messages.map((msg, i) => (
            <p key={i}>
              <span
                className={
                  msg.user === "System"
                    ? "text-red-500 font-semibold"
                    : "font-bold"
                }
              >
                {msg.user}:
              </span>{" "}
              {msg.text}
            </p>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
