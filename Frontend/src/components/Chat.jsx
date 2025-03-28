import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import dayjs from "dayjs";

const Chat = ({ isOpen, toggleChat }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [socket, setSocket] = useState(null);

    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws/chat/");

        ws.onopen = () => console.log("Connected to WebSocket");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);
        };

        ws.onclose = () => console.log("WebSocket Disconnected");

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

    const groupedMessages = messages.reduce((acc, msg) => {
        const date = dayjs(msg.timestamp).format("YYYY-MM-DD");
        if (!acc[date]) acc[date] = [];
        acc[date].push(msg);
        return acc;
    }, {});

    return (
        <div className={`fixed bottom-16 right-6 w-80 bg-white shadow-lg rounded-lg border transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} p-4`}>
            <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-lg font-semibold">Chat</h2>
                <button onClick={toggleChat} className="text-gray-600 hover:text-red-500">
                    <X size={20} />
                </button>
            </div>
            <div className="h-64 overflow-y-auto p-2 space-y-4">
                {Object.entries(groupedMessages).map(([date, msgs]) => (
                    <div key={date}>
                        <p className="text-center text-gray-500 text-sm font-semibold mb-2">{dayjs(date).format("MMMM D, YYYY")}</p>
                        {msgs.map((msg, index) => (
                            <p key={index} className="text-sm bg-gray-100 p-2 rounded-md">
                                <strong>{msg.sender}:</strong> {msg.message}
                                <br />
                                <span className="text-xs text-gray-500">{dayjs(msg.timestamp).format("hh:mm A")}</span>
                            </p>
                        ))}
                    </div>
                ))}
            </div>
            <div className="mt-2 flex">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-md"
                />
                <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white px-3 py-2 rounded-md">Send</button>
            </div>
        </div>
    );
};

export default Chat;