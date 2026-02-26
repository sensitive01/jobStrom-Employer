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
  const [showMobileList, setShowMobileList] = useState(true);

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

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowMobileList(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Shortlisted":
      case "Interview Scheduled":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Under Review":
      case "Applied":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] lg:h-[calc(100vh-80px)] bg-slate-50 overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
        {/* Page Header - Hidden on mobile when chat is open */}
        <div
          className={`bg-white px-4 sm:px-6 py-4 border-b border-slate-100 ${!showMobileList ? "hidden md:block" : ""}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                Messages
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Communicate with your candidates
              </p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Sidebar - Chat List */}
          <div
            className={`${showMobileList ? "flex" : "hidden md:flex"} w-full md:w-80 lg:w-96 bg-white border-r border-slate-100 flex-col transition-all duration-300`}
          >
            {/* Search and Filter */}
            <div className="p-4 border-b border-slate-100 space-y-3 bg-white">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
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
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
              </div>

              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
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
                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl whitespace-nowrap transition-all border ${
                      filterStatus === status
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                        : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto bg-slate-50/30">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat)}
                  className={`p-4 border-b border-slate-50 cursor-pointer transition-all hover:bg-white ${
                    selectedChat?.id === chat.id
                      ? "bg-white border-r-4 border-r-indigo-600 shadow-sm z-10"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-100">
                        {chat.avatar}
                      </div>
                      {chat.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-0.5">
                        <h3 className="font-bold text-slate-800 truncate text-sm tracking-tight uppercase">
                          {chat.candidateName}
                        </h3>
                        <span className="text-[9px] font-bold text-slate-400 ml-2 flex-shrink-0 uppercase tracking-tighter">
                          {chat.time}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1.5">
                        <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tighter">
                          {chat.jobTitle}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-xs truncate flex-1 font-medium ${chat.unread > 0 ? "text-slate-900" : "text-slate-500"}`}
                        >
                          {chat.lastMessage}
                        </p>
                        {chat.unread > 0 && (
                          <span className="flex-shrink-0 w-4 h-4 bg-rose-600 text-white text-[9px] font-black rounded-lg flex items-center justify-center animate-pulse">
                            {chat.unread}
                          </span>
                        )}
                      </div>

                      <div className="mt-2.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full border ${getStatusColor(
                            chat.applicationStatus,
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
          <div
            className={`${!showMobileList ? "flex" : "hidden md:flex"} flex-1 flex flex-col bg-white border-l border-slate-100 relative`}
          >
            {/* Chat Header */}
            <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-white shadow-sm z-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                  {/* Back button on mobile */}
                  <button
                    onClick={() => setShowMobileList(true)}
                    className="md:hidden p-2 -ml-2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-base sm:text-lg shadow-lg shadow-indigo-100">
                      {selectedChat?.avatar}
                    </div>
                    {selectedChat?.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight uppercase truncate">
                      {selectedChat?.candidateName}
                    </h2>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      <span className="truncate">{selectedChat?.jobTitle}</span>
                      <span>•</span>
                      <span
                        className={
                          selectedChat?.online
                            ? "text-emerald-500"
                            : "text-slate-400"
                        }
                      >
                        {selectedChat?.online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all">
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
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </button>
                  <button className="p-2 text-slate-400 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all hidden sm:block">
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
                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
              {selectedChat?.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[75%] ${message.isMine ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {!message.isMine && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white font-black text-[10px] flex-shrink-0 shadow-sm self-end">
                        {selectedChat?.avatar}
                      </div>
                    )}
                    <div
                      className={`flex flex-col ${message.isMine ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`px-4 py-2.5 shadow-sm ${
                          message.isMine
                            ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none"
                            : "bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-none font-medium"
                        }`}
                      >
                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-left">
                          {message.text}
                        </p>
                      </div>
                      <span className="text-[9px] font-black text-slate-400 mt-1.5 px-1 uppercase tracking-tighter">
                        {message.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 sm:gap-3 bg-slate-50 border border-slate-200 p-1.5 sm:p-2 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all"
              >
                <button
                  type="button"
                  className="p-2 text-slate-400 hover:bg-white hover:text-indigo-600 rounded-xl transition-all flex-shrink-0"
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
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </button>

                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  rows="1"
                  className="flex-1 bg-transparent border-none outline-none resize-none text-xs sm:text-sm text-slate-900 placeholder-slate-400 py-1.5"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />

                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 disabled:opacity-50 disabled:shadow-none flex-shrink-0"
                >
                  <svg
                    className="w-5 h-5 rotate-90"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
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
