import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { sendMessage } from "../../../../api/service/employerService";

const ChatComponent = ({ candidateId, candidateName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const employerId = localStorage.getItem("userId");
  const employerName = localStorage.getItem("userName") || "Recruiter";

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history on component mount
  useEffect(() => {
    loadChatHistory();
  }, [candidateId]);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      // TODO: Replace with your actual API call
      // const response = await getChatHistory(employerId, candidateId);
      // setMessages(response.data.messages || []);

      // Sample messages for demonstration
      setMessages([
        {
          _id: "1",
          senderId: candidateId,
          senderName: candidateName,
          message: "Hello! Thank you for reviewing my application.",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isRecruiter: false,
        },
        {
          _id: "2",
          senderId: employerId,
          senderName: employerName,
          message:
            "Hi! Your profile looks great. I'd like to discuss the position further.",
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          isRecruiter: true,
        },
      ]);
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
      senderId: employerId,
      senderName: employerName,
      receiverId: candidateId,
      receiverName: candidateName,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRecruiter: true,
    };

    try {
     
      await sendMessage(messageData);

      // Add message to local state immediately for better UX
      setMessages((prev) => [
        ...prev,
        { ...messageData, _id: Date.now().toString() },
      ]);
      setNewMessage("");
      toast.success("Message sent!");
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
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
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
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${
                  msg.isRecruiter ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    msg.isRecruiter
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed break-words">
                    {msg.message}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.isRecruiter ? "text-purple-200" : "text-gray-500"
                    }`}
                  >
                    {formatMessageTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
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
                "Could you share more details about your experience?"
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
