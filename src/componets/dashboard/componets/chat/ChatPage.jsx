import React, { useState, useEffect, useRef, useCallback } from "react";
import MainLayout from "../../layout/MainLayout";
import { axiosInstance } from "../../../../api/axiosInstance/axiosInstance";
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BASE_ROUTE_JOBSTORM.replace(
  /\/employer\/?$/,
  "",
);

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);
  const [loading, setLoading] = useState(true);

  const employerId = localStorage.getItem("userId");
  const employerName = localStorage.getItem("companyName") || "Employer";
  const employerImage = localStorage.getItem("companyLogo") || "";

  const socketRef = useRef();
  const chatMessagesRef = useRef(null);
  const selectedChatRef = useRef(null);

  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on("receive_chat_message", (data) => {
      setChats((prevChats) => {
        return prevChats.map((chat) => {
          if (chat._id === data.room) {
            const isSelected = selectedChatRef.current?._id === data.room;
            const newMessages = [...(chat.messages || []), data.messageData];

            if (isSelected) {
              axiosInstance
                .post("/chat/mark-read", {
                  employerId,
                  employeeId: chat.employeeId,
                  jobId: chat.jobId || null,
                  viewerType: "employer",
                })
                .catch(console.error);
            }

            return {
              ...chat,
              messages: newMessages,
              lastMessage: data.messageData.message,
              lastMessageTime: new Date().toISOString(),
              unreadCountEmployer: isSelected
                ? 0
                : (chat.unreadCountEmployer || 0) + 1,
            };
          }
          return chat;
        });
      });

      setSelectedChat((prev) => {
        if (prev && prev._id === data.room) {
          return {
            ...prev,
            messages: [...(prev.messages || []), data.messageData],
          };
        }
        return prev;
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [employerId]);

  const fetchChats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/chat/employer/${employerId}`);
      if (res.data.success) {
        setChats(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  }, [employerId]);

  useEffect(() => {
    if (employerId) {
      fetchChats();
    }
  }, [employerId, fetchChats]);

  const handleChatSelect = async (chat) => {
    console.log("Selecting chat:", chat);
    setSelectedChat(chat);
    setShowMobileList(false);
    socketRef.current.emit("join_chat_room", chat._id);

    // Reset unread count locally
    setChats((prev) =>
      prev.map((c) =>
        c._id === chat._id ? { ...c, unreadCountEmployer: 0 } : c,
      ),
    );

    // Mark as read on server
    axiosInstance
      .post("/chat/mark-read", {
        employerId,
        employeeId: chat.employeeId,
        jobId: chat.jobId || null,
        viewerType: "employer",
      })
      .catch(console.error);

    // Fetch full message history for this chat
    try {
      console.log(
        "Fetching messages for chat between",
        employerId,
        "and",
        chat.employeeId,
      );
      const res = await axiosInstance.get("/chat/messages", {
        params: {
          employeeId: chat.employeeId,
          employerId,
          jobId:
            typeof chat.jobId === "object"
              ? chat.jobId._id
              : chat.jobId || undefined,
        },
      });
      console.log("Messages fetch result:", res.data);
      if (res.data.success) {
        setSelectedChat((prev) => ({
          ...prev,
          messages: res.data.data.messages || [],
        }));
      }
    } catch (err) {
      console.error("Failed to load chat messages:", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat) return;

    const messageData = {
      employerId,
      employeeId: selectedChat.employeeId,
      jobId: selectedChat.jobId || null,
      message: messageInput.trim(),
      sender: "employer",
      employerName,
      employerImage,
      employeeName: selectedChat.employeeName,
      employeeImage: selectedChat.employeeImage,
    };

    try {
      const resp = await axiosInstance.post("/sendchats", messageData);

      if (resp.data.success) {
        const newMessage = resp.data.data.message;

        const updatedMessages = [...(selectedChat.messages || []), newMessage];
        const updatedChat = {
          ...selectedChat,
          messages: updatedMessages,
          lastMessage: newMessage.message,
          lastMessageTime: new Date().toISOString(),
        };

        setSelectedChat(updatedChat);
        setChats((prev) =>
          prev.map((c) => (c._id === selectedChat._id ? updatedChat : c)),
        );

        socketRef.current.emit("send_chat_message", {
          room: selectedChat._id,
          messageData: newMessage,
        });

        setMessageInput("");
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      (chat.employeeName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (chat.jobTitle || "").toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatTime = (time) => {
    if (!time) return "";
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] lg:h-[calc(100vh-80px)] bg-slate-50 overflow-hidden rounded-2xl border border-slate-100 shadow-sm mt-4">
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

        <div className="flex-1 flex overflow-hidden relative">
          <div
            className={`${showMobileList ? "flex" : "hidden md:flex"} w-full md:w-80 lg:w-96 bg-white border-r border-slate-100 flex-col transition-all duration-300`}
          >
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
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50/30">
              {loading ? (
                <div className="text-center p-4 text-slate-400">
                  Loading chats...
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="text-center p-4 text-slate-400">
                  No conversations found
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => handleChatSelect(chat)}
                    className={`p-4 border-b border-slate-50 cursor-pointer transition-all hover:bg-white ${
                      selectedChat?._id === chat._id
                        ? "bg-white border-r-4 border-r-indigo-600 shadow-sm z-10"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-100 overflow-hidden">
                          {chat.employeeImage ? (
                            <img
                              src={chat.employeeImage}
                              alt="C"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            chat.employeeName?.charAt(0) || "C"
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-0.5">
                          <h3 className="font-bold text-slate-800 truncate text-sm tracking-tight uppercase">
                            {chat.employeeName || "Candidate"}
                          </h3>
                          <span className="text-[9px] font-bold text-slate-400 ml-2 flex-shrink-0 uppercase tracking-tighter">
                            {formatTime(chat.lastMessageTime)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 mb-1.5">
                          <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tighter">
                            {chat.jobTitle }
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={`text-xs truncate flex-1 font-medium ${
                              chat.unreadCountEmployer > 0
                                ? "text-slate-900"
                                : "text-slate-500"
                            }`}
                          >
                            {chat.lastMessage}
                          </p>
                          {chat.unreadCountEmployer > 0 && (
                            <span className="flex-shrink-0 w-4 h-4 bg-rose-600 text-white text-[9px] font-black rounded-lg flex items-center justify-center animate-pulse">
                              {chat.unreadCountEmployer}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div
            className={`${!showMobileList ? "flex" : "hidden md:flex"} flex-1 flex flex-col bg-white border-l border-slate-100 relative`}
          >
            {selectedChat ? (
              <>
                <div className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-white shadow-sm z-20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
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
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-base sm:text-lg shadow-lg shadow-indigo-100 overflow-hidden">
                          {selectedChat?.employeeImage ? (
                            <img
                              src={selectedChat.employeeImage}
                              alt="C"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            selectedChat?.employeeName?.charAt(0) || "C"
                          )}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight uppercase truncate">
                          {selectedChat?.employeeName || "Candidate"}
                        </h2>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          <span className="truncate">
                            {selectedChat?.jobTitle || "Direct Message"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50"
                  ref={chatMessagesRef}
                >
                  {(selectedChat?.messages || []).map((message, i) => {
                    const isMine = message.sender === "employer";
                    return (
                      <div
                        key={message._id || i}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[75%] ${isMine ? "flex-row-reverse" : "flex-row"}`}
                        >
                          {!isMine && (
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center text-white font-black text-[10px] flex-shrink-0 shadow-sm self-end overflow-hidden">
                              {selectedChat?.employeeImage ? (
                                <img
                                  src={selectedChat.employeeImage}
                                  alt="C"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                selectedChat?.employeeName?.charAt(0) || "C"
                              )}
                            </div>
                          )}
                          <div
                            className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                          >
                            <div
                              className={`px-4 py-2.5 shadow-sm ${
                                isMine
                                  ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none"
                                  : "bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-none font-medium"
                              }`}
                            >
                              <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-left">
                                {message.message}
                              </p>
                            </div>
                            <span className="text-[9px] font-black text-slate-400 mt-1.5 px-1 uppercase tracking-tighter">
                              {formatTime(message.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
                  <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-2 sm:gap-3 bg-slate-50 border border-slate-200 p-1.5 sm:p-2 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all"
                  >
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                      rows="1"
                      className="flex-1 bg-transparent border-none outline-none resize-none text-xs sm:text-sm text-slate-900 placeholder-slate-400 py-1.5 ml-2"
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
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-50/50">
                <div className="text-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8"
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
                  </div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight uppercase mb-2">
                    Your Messages
                  </h3>
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">
                    Select a conversation from the sidebar to view chat history
                    and start communicating with candidates.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;
