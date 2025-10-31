import React, { useState } from "react";
import MainLayout from "../../layout/MainLayout";

// Dummy chat data for employer dashboard
const dummyChats = [
  {
    id: 1,
    candidateName: "Sarah Johnson",
    avatar: "SJ",
    jobTitle: "React Developer",
    jobId: "JS43529",
    lastMessage: "Thank you for considering my application!",
    time: "2 min ago",
    unread: 2,
    online: true,
    applicationStatus: "Under Review",
    messages: [
      {
        id: 1,
        sender: "Sarah Johnson",
        text: "Hello! I recently applied for the React Developer position.",
        time: "10:30 AM",
        isMine: false,
      },
      {
        id: 2,
        sender: "You",
        text: "Hi Sarah! Thanks for applying. We received your application and are reviewing it.",
        time: "10:32 AM",
        isMine: true,
      },
      {
        id: 3,
        sender: "Sarah Johnson",
        text: "Great! I have 4 years of experience with React and Next.js.",
        time: "10:35 AM",
        isMine: false,
      },
      {
        id: 4,
        sender: "You",
        text: "That's excellent. We'll get back to you within 2-3 business days.",
        time: "10:36 AM",
        isMine: true,
      },
      {
        id: 5,
        sender: "Sarah Johnson",
        text: "Thank you for considering my application!",
        time: "10:38 AM",
        isMine: false,
      },
    ],
  },
  {
    id: 2,
    candidateName: "Michael Chen",
    avatar: "MC",
    jobTitle: "Flutter Developer",
    jobId: "JS97020",
    lastMessage: "When can I expect to hear back?",
    time: "15 min ago",
    unread: 1,
    online: true,
    applicationStatus: "Shortlisted",
    messages: [
      {
        id: 1,
        sender: "Michael Chen",
        text: "Hi, I submitted my portfolio along with the application.",
        time: "9:15 AM",
        isMine: false,
      },
      {
        id: 2,
        sender: "You",
        text: "Hello Michael! Yes, we reviewed your portfolio. Very impressive work!",
        time: "9:20 AM",
        isMine: true,
      },
      {
        id: 3,
        sender: "Michael Chen",
        text: "Thank you! When can I expect to hear back?",
        time: "9:22 AM",
        isMine: false,
      },
    ],
  },
  {
    id: 3,
    candidateName: "Emily Rodriguez",
    avatar: "ER",
    jobTitle: "Digital Marketing Specialist",
    jobId: "JS98558",
    lastMessage: "I have experience in SEO and social media marketing.",
    time: "1 hour ago",
    unread: 0,
    online: false,
    applicationStatus: "Applied",
    messages: [
      {
        id: 1,
        sender: "Emily Rodriguez",
        text: "Hi! I'm very interested in the Digital Marketing position.",
        time: "8:00 AM",
        isMine: false,
      },
      {
        id: 2,
        sender: "You",
        text: "Hello Emily! Great to hear from you.",
        time: "8:10 AM",
        isMine: true,
      },
      {
        id: 3,
        sender: "Emily Rodriguez",
        text: "I have experience in SEO and social media marketing.",
        time: "8:15 AM",
        isMine: false,
      },
    ],
  },
  {
    id: 4,
    candidateName: "David Park",
    avatar: "DP",
    jobTitle: "Flutter Developer",
    jobId: "JS97020",
    lastMessage: "Looking forward to the interview.",
    time: "2 hours ago",
    unread: 0,
    online: false,
    applicationStatus: "Interview Scheduled",
    messages: [
      {
        id: 1,
        sender: "David Park",
        text: "Hello, I received the interview invitation.",
        time: "7:30 AM",
        isMine: false,
      },
      {
        id: 2,
        sender: "You",
        text: "Hi David! Yes, the interview is scheduled for Thursday at 2 PM.",
        time: "7:45 AM",
        isMine: true,
      },
      {
        id: 3,
        sender: "David Park",
        text: "Looking forward to the interview.",
        time: "7:50 AM",
        isMine: false,
      },
    ],
  },
  {
    id: 5,
    candidateName: "Lisa Thompson",
    avatar: "LT",
    jobTitle: "React Developer",
    jobId: "JS43529",
    lastMessage: "Can you share more details about the role?",
    time: "3 hours ago",
    unread: 3,
    online: true,
    applicationStatus: "Applied",
    messages: [
      {
        id: 1,
        sender: "Lisa Thompson",
        text: "Hi, I'm interested in the React Developer role.",
        time: "6:00 AM",
        isMine: false,
      },
      {
        id: 2,
        sender: "Lisa Thompson",
        text: "Can you share more details about the role?",
        time: "6:05 AM",
        isMine: false,
      },
    ],
  },
  {
    id: 6,
    candidateName: "James Wilson",
    avatar: "JW",
    jobTitle: "Digital Marketing Specialist",
    jobId: "JS98558",
    lastMessage: "Thank you for the update!",
    time: "Yesterday",
    unread: 0,
    online: false,
    applicationStatus: "Rejected",
    messages: [
      {
        id: 1,
        sender: "James Wilson",
        text: "Hi, what's the status of my application?",
        time: "Yesterday",
        isMine: false,
      },
      {
        id: 2,
        sender: "You",
        text: "Hello James, we appreciate your interest but decided to move forward with other candidates.",
        time: "Yesterday",
        isMine: true,
      },
      {
        id: 3,
        sender: "James Wilson",
        text: "Thank you for the update!",
        time: "Yesterday",
        isMine: false,
      },
    ],
  },
  {
    id: 7,
    candidateName: "Priya Sharma",
    avatar: "PS",
    jobTitle: "React Developer",
    jobId: "JS43529",
    lastMessage: "I can start immediately if selected.",
    time: "Yesterday",
    unread: 0,
    online: true,
    applicationStatus: "Under Review",
    messages: [
      {
        id: 1,
        sender: "Priya Sharma",
        text: "Hello! I have 5 years of React experience.",
        time: "Yesterday",
        isMine: false,
      },
      {
        id: 2,
        sender: "Priya Sharma",
        text: "I can start immediately if selected.",
        time: "Yesterday",
        isMine: false,
      },
    ],
  },
];

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(dummyChats[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  const filteredChats = dummyChats.filter((chat) => {
    const matchesSearch =
      chat.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "All" || chat.applicationStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Shortlisted":
      case "Interview Scheduled":
        return "bg-green-100 text-green-600";
      case "Under Review":
      case "Applied":
        return "bg-blue-100 text-blue-600";
      case "Rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Page Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-sm text-gray-500 mt-1">
                Communicate with your candidates
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Message
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Chat List */}
          <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
            {/* Search and Filter */}
            <div className="p-4 border-b border-gray-200 space-y-3">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                  "All",
                  "Applied",
                  "Under Review",
                  "Shortlisted",
                  "Interview Scheduled",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                      filterStatus === status
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-all hover:bg-gray-50 ${
                    selectedChat.id === chat.id
                      ? "bg-purple-50 border-l-4 border-l-purple-600"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold text-lg">
                        {chat.avatar}
                      </div>
                      {chat.online && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {chat.candidateName}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                          {chat.time}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs text-gray-500 truncate">
                          {chat.jobTitle}
                        </p>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-400">
                          {chat.jobId}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-gray-600 truncate flex-1">
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <span className="flex-shrink-0 w-5 h-5 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {chat.unread}
                          </span>
                        )}
                      </div>

                      <div className="mt-2">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                            chat.applicationStatus
                          )}`}
                        >
                          {chat.applicationStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold text-lg">
                      {selectedChat.avatar}
                    </div>
                    {selectedChat.online && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedChat.candidateName}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{selectedChat.jobTitle}</span>
                      <span>•</span>
                      <span>{selectedChat.jobId}</span>
                      <span>•</span>
                      <span
                        className={
                          selectedChat.online
                            ? "text-green-500"
                            : "text-gray-400"
                        }
                      >
                        {selectedChat.online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {selectedChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-2xl ${
                      message.isMine ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {!message.isMine && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {selectedChat.avatar}
                      </div>
                    )}
                    <div
                      className={`flex flex-col ${
                        message.isMine ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.isMine
                            ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-br-sm"
                            : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {message.text}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 px-1">
                        {message.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <form
                onSubmit={handleSendMessage}
                className="flex items-end gap-3"
              >
                <button
                  type="button"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>

                <div className="flex-1 flex items-end gap-2 bg-gray-100 rounded-xl px-4 py-2">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    rows="1"
                    className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-gray-900 placeholder-gray-500 max-h-32"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors flex-shrink-0"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;
