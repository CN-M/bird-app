import { useEffect, useState } from "react";
import { MainLayout } from "../components/MainLayout";
import { useAuthStore } from "../lib/authStore";

export const Messages = () => {
  const user = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState<any[]>([]); // Store messages as objects with content, username, and type
  const [input, setInput] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [recipient, setRecipient] = useState<string>(""); // To store the username of the user being messaged

  useEffect(() => {
    if (!user) return;

    // Establish WebSocket connection
    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
      // Send username when the user connects
      ws.send(JSON.stringify({ type: "join", username: user.username }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        setMessages((prev) => [...prev, data]); // Append new messages
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(ws);

    // Clean up the WebSocket connection on unmount
    return () => {
      ws.close();
    };
  }, [user]);

  const handleSendMessage = () => {
    if (socket && input.trim() && recipient) {
      const message = JSON.stringify({
        type: "message",
        content: input,
        username: user?.username,
        toUsername: recipient, // Send message to a specific recipient
      });
      socket.send(message);
      setMessages((prev) => [
        ...prev,
        {
          type: "message",
          content: input,
          username: user?.username,
          toUsername: recipient,
        },
      ]);
      setInput(""); // Clear input field
    }
  };

  return (
    <MainLayout classNames="lg:w-1/4">
      {user ? (
        <div className="w-full">
          <div className="space-x-4">
            {/* Select recipient */}
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter recipient username"
              className="border p-2 rounded-lg"
            />
          </div>

          <div className="chat-container border border-gray-300 p-4 h-96 overflow-y-auto rounded-lg shadow-lg mt-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message my-2 p-3 rounded-lg max-w-xs ${
                  msg.username === user?.username
                    ? "bg-blue-500 text-white ml-auto text-left"
                    : "bg-gray-200 text-black mr-auto text-left"
                }`}
              >
                <strong>{msg.username}:</strong> {msg.content}
              </div>
            ))}
          </div>

          <div className="input-container flex mt-4 space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <p>Login to start having conversations</p>
      )}
    </MainLayout>
  );
};
