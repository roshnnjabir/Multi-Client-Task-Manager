import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [socket, setSocket] = useState(null);

    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws/chat/");

        ws.onopen = () => {
            console.log("Connected to WebSocket");
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            setMessages((prev) => [...prev, data]);
        };

        ws.onclose = () => {
            console.log("WebSocket Disconnected");
        };

        setSocket(ws);
        return () => ws.close();
    }, []);

    const sendMessage = () => {
        if (socket && message.trim() !== "") {
            socket.send(JSON.stringify({
                message: message,
                sender: user?.name || "Unknown",
                is_staff: user?.is_staff || false, 
            }));
            setMessage("");
        }
    };

    return (
        <div>
            <h2>Chat</h2>
            <div style={{ border: "1px solid black", height: "300px", overflowY: "auto" }}>
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.sender}:</strong> {msg.message}
                    </p>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
