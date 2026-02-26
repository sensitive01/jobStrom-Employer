import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../../../api/axiosInstance/axiosInstance";
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000";

const ChatComponent = ({ candidateId, candidateName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);

  const chatMessagesRef = useRef(null);
  const employerId = localStorage.getItem("userId");
  const employerData = JSON.parse(localStorage.getItem("employerData") || "{}");
  const employerName =
    employerData?.companyName ||
    localStorage.getItem("userName") ||
    "Recruiter";
  const employerImage = localStorage.getItem("userProfilePic") || "";

  const socketRef = useRef();

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history on component mount
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("receive_chat_message", (data) => {
      // Only process if it matches our current room
      setChatId((currentChatId) => {
        if (data.room === currentChatId) {
          setMessages((prev) => {
            // Deduplicate multiple socket firings protecting UI from Double-Renders
            const isDuplicate = prev.some(
              (msg) => msg._id === data.messageData._id,
            );
            if (isDuplicate) return prev;
            return [...prev, data.messageData];
          });
        }
        return currentChatId;
      });
    });

    loadChatHistory();

    return () => {
      socketRef.current.disconnect();
    };
  }, [candidateId]);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/chat/messages`, {
        params: {
          employerId: employerId,
          employeeId: candidateId,
        },
      });

      if (res.data.success && res.data.data) {
        setMessages(res.data.data.messages || []);
        if (res.data.data.chatId) {
          setChatId(res.data.data.chatId);
          socketRef.current.emit("join_chat_room", res.data.data.chatId);
        }
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      toast.error("Failed to load chat history");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      return;
    }

    const messageData = {
      employeeId: candidateId,
      employerId: employerId,
      message: newMessage.trim(),
      sender: "employer",
      employeeName: candidateName,
      employerName: employerName,
      employerImage: employerImage,
    };

    try {
      const resp = await axiosInstance.post("/sendchats", messageData);

      if (resp.data.success) {
        const sentMessage = resp.data.data.message;
        const newChatId = resp.data.data.chatId;

        // If this was our first message, set the room id
        if (!chatId) {
          setChatId(newChatId);
          socketRef.current.emit("join_chat_room", newChatId);
        }

        // Add message to local state immediately
        setMessages((prev) => [...prev, sentMessage]);

        // Broadcast over socket
        socketRef.current.emit("send_chat_message", {
          room: newChatId,
          messageData: sentMessage,
        });

        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
            {candidateName?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold">{candidateName}</h3>
            <p className="text-xs text-purple-100">Candidate</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Messages Container */}
      <div
        ref={chatMessagesRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <svg
              className="w-16 h-16 text-gray-300 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-gray-500 font-medium">No messages yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Start the conversation with {candidateName}
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isRecruiter = msg.sender === "employer";
              return (
                <div
                  key={msg._id || idx}
                  className={`flex ${
                    isRecruiter ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isRecruiter
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-800 shadow-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">
                      {msg.message}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        isRecruiter ? "text-purple-200" : "text-gray-500"
                      }`}
                    >
                      {formatMessageTime(msg.createdAt || msg.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white border-t border-gray-200"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              newMessage.trim()
                ? "bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* Quick Actions (Optional) */}
      <div className="px-4 pb-3 bg-white border-t border-gray-100">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() =>
              setNewMessage("When would you be available for an interview?")
            }
            className="px-3 py-1.5 text-xs bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors whitespace-nowrap"
          >
            Schedule Interview
          </button>
          <button
            onClick={() =>
              setNewMessage(
                "Could you share more details about your experience?",
              )
            }
            className="px-3 py-1.5 text-xs bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors whitespace-nowrap"
          >
            Ask About Experience
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
