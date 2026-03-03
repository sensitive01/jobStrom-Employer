import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import {
  getInterviewDetails,
  getActiveJobPosted,
  getAppliedCandidates,
  updateJobApplicationStatus,
  generalAIChat,
} from "../../../../api/service/employerService";
import { toast } from "react-toastify";

const Interviews = () => {
  const employerId = localStorage.getItem("userId");
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [interviewData, setInterviewData] = useState({
    date: "",
    time: "",
    endTime: "",
    type: "Online",
    link: "",
    notes: "",
  });

  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Recruitment Assistant. How can I help you with your interviews today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = React.useRef(null);

  // Dragging State
  const [chatPosition, setChatPosition] = useState({
    x: window.innerWidth - 420,
    y: window.innerHeight - 520,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - chatPosition.x,
      y: e.clientY - chatPosition.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Boundaries
      const maxX = window.innerWidth - 400;
      const maxY = window.innerHeight - 500;

      setChatPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [intResponse, jobsResponse] = await Promise.all([
          getInterviewDetails(employerId),
          getActiveJobPosted(employerId),
        ]);

        if (intResponse?.data?.success && intResponse?.data?.data) {
          setInterviews(intResponse.data.data);
        } else if (intResponse?.data) {
          setInterviews(
            Array.isArray(intResponse.data) ? intResponse.data : [],
          );
        }

        if (jobsResponse?.status === 200 || jobsResponse?.data) {
          setJobs(jobsResponse.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const scrollToChatBottom = () => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    scrollToChatBottom();

    if (employerId) fetchData();
  }, [employerId, chatMessages]);

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!selectedJobId) {
        setApplicants([]);
        return;
      }
      try {
        const response = await getAppliedCandidates(selectedJobId);
        if (response?.data?.success) {
          setApplicants(response.data.applications || []);
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      }
    };
    fetchApplicants();
  }, [selectedJobId]);

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (
      !selectedJobId ||
      !selectedApplicant ||
      !interviewData.date ||
      !interviewData.time
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setScheduling(true);
      const res = await updateJobApplicationStatus(
        selectedJobId,
        selectedApplicant._id,
        "Interview",
        {
          interviewDate: interviewData.date,
          interviewTime: interviewData.time,
          interviewEndTime: interviewData.endTime,
          interviewType: interviewData.type,
          interviewLink: interviewData.link,
          interviewNotes: interviewData.notes,
        },
      );

      if (res?.status === 200 || res?.data?.success) {
        toast.success("Interview scheduled successfully");
        setIsModalOpen(false);
        // Reset form
        setSelectedJobId("");
        setSelectedApplicant(null);
        setInterviewData({
          date: "",
          time: "",
          endTime: "",
          type: "Online",
          link: "",
          notes: "",
        });
        // Refresh list
        const updated = await getInterviewDetails(employerId);
        if (updated?.data?.data) setInterviews(updated.data.data);
      } else {
        toast.error("Failed to schedule interview");
      }
    } catch (error) {
      console.error("Schedule error:", error);
      toast.error("An error occurred");
    } finally {
      setScheduling(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    const newMessages = [
      ...chatMessages,
      { role: "user", content: userMessage },
    ];
    setChatMessages(newMessages);
    setChatInput("");
    setIsTyping(true);

    try {
      const response = await generalAIChat(userMessage, chatMessages);
      if (response?.status === 200 && response?.data?.success) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response.data.data,
          },
        ]);
      } else {
        toast.error(
          response?.data?.message ||
            "AI Assistant is offline. Please try again.",
        );
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg =
        error.response?.data?.message || "AI Assistant connection lost";
      toast.error(errorMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const calculateTotalHours = (interviewsList) => {
    let totalMinutes = 0;
    interviewsList.forEach((interview) => {
      if (interview.interviewTime && interview.interviewEndTime) {
        const [startH, startM] = interview.interviewTime.split(":").map(Number);
        const [endH, endM] = interview.interviewEndTime.split(":").map(Number);
        const startTotal = startH * 60 + startM;
        const endTotal = endH * 60 + endM;
        if (endTotal > startTotal) {
          totalMinutes += endTotal - startTotal;
        }
      } else {
        // Fallback or skip if field missing
        // totalMinutes += 90; // Don't make dummy data
      }
    });
    return (totalMinutes / 60).toFixed(1);
  };

  // Separate interviews by sorting if needed.
  // For the mockup layout, we will place real API data into "Upcoming"
  // and use a stylized fallback for "Past" to match aesthetics if empty.
  const now = new Date();

  const upcomingInterviews = interviews.filter((interview) => {
    if (!interview.interviewDate) return true;
    const invDate = new Date(interview.interviewDate);
    return invDate >= new Date(now.setHours(0, 0, 0, 0));
  });

  const pastInterviews = interviews.filter((interview) => {
    if (!interview.interviewDate) return false;
    const invDate = new Date(interview.interviewDate);
    return invDate < new Date(now.setHours(0, 0, 0, 0));
  });

  const formatDisplayTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <svg
                className="w-7 h-7 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                Smart Interview Hub
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage schedules and prepare with AI-assisted tools.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg font-semibold transition-colors border border-yellow-200 shadow-sm text-sm"
            >
              <svg
                className="w-4 h-4 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              AI Question Gen
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#5A45ED] hover:bg-[#4d3cd2] text-white rounded-lg font-semibold transition-colors shadow-sm text-sm"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Schedule Interview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Interviews List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Interviews */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50">
                <h2 className="text-base font-bold text-gray-900">
                  Upcoming Interviews
                </h2>
              </div>
              <div className="divide-y divide-gray-50">
                {loading ? (
                  <div className="p-10 text-center text-gray-500 flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                    Loading interviews...
                  </div>
                ) : upcomingInterviews.length > 0 ? (
                  upcomingInterviews.map((interview, index) => (
                    <div
                      key={index}
                      className="px-6 py-4 hover:bg-gray-50/50 transition-colors flex flex-wrap md:flex-nowrap items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm flex-shrink-0">
                          {getInitials(interview.employee?.userName)}
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold text-gray-900 leading-tight">
                            {interview.employee?.userName || "Unknown"}
                          </h3>
                          <p className="text-[13px] text-gray-500 mb-1 font-medium">
                            {interview.jobTitle ||
                              interview.employee?.currentrole}
                          </p>
                          <div className="flex items-center gap-3 text-xs font-semibold text-gray-400">
                            <span className="flex items-center gap-1.5">
                              <svg
                                className="w-3.5 h-3.5 opacity-75"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {interview.interviewDate
                                ? new Date(interview.interviewDate)
                                    .toISOString()
                                    .split("T")[0]
                                : "TBD"}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <svg
                                className="w-3.5 h-3.5 opacity-75"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {formatDisplayTime(interview.interviewTime) ||
                                "TBD"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                        {interview.interviewLink && (
                          <a
                            href={interview.interviewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#5A45ED] hover:bg-[#4d3cd2] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm flex-1 md:flex-none"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v2a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h8a2 2 0 012 2v2z" />
                            </svg>
                            Join Meet
                          </a>
                        )}
                        <div className="flex items-center gap-1 ml-auto"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500 font-medium text-sm">
                    No upcoming interviews scheduled.
                  </div>
                )}
              </div>
            </div>

            {/* Past Interviews */}
            <div className="bg-[#F8FAF9] rounded-xl shadow-sm border border-emerald-50 overflow-hidden">
              <div className="px-6 py-5 border-b border-emerald-50/70">
                <h2 className="text-base font-bold text-gray-800">
                  Past Interviews
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                ) : pastInterviews.length > 0 ? (
                  pastInterviews.map((interview, index) => (
                    <div
                      key={index}
                      className="px-6 py-4 flex items-center justify-between gap-4 opacity-75 grayscale-[30%]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm flex-shrink-0">
                          {getInitials(interview.employee?.userName)}
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold text-gray-700 leading-tight">
                            {interview.employee?.userName || "Unknown"}
                          </h3>
                          <p className="text-[13px] text-gray-400 mb-1 font-medium">
                            {interview.jobTitle ||
                              interview.employee?.currentrole}
                          </p>
                          <div className="flex items-center gap-3 text-xs font-semibold text-gray-400">
                            <span className="flex items-center gap-1.5">
                              <svg
                                className="w-3.5 h-3.5 opacity-75"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {interview.interviewDate
                                ? new Date(interview.interviewDate)
                                    .toISOString()
                                    .split("T")[0]
                                : "TBD"}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <svg
                                className="w-3.5 h-3.5 opacity-75"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {formatDisplayTime(interview.interviewTime) ||
                                "TBD"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <span className="px-3 md:px-4 py-1.5 bg-green-100/60 text-green-700 text-xs font-bold rounded-full border border-green-200/50">
                          Completed
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500 font-medium text-sm">
                    No past interviews.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Summaries & Guides */}
          <div className="space-y-6">
            {/* Weekly Summary */}
            <div className="bg-gradient-to-br from-[#7752FF] to-[#5A45ED] rounded-2xl shadow-md p-6 p-7 text-white overflow-hidden relative">
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white opacity-10"></div>
              <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-white opacity-10"></div>

              <div className="relative z-10">
                <h3 className="text-base font-bold mb-1">Weekly Summary</h3>
                <p className="text-indigo-100 text-[13px] mb-6 font-medium">
                  You have a busy week ahead!
                </p>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-white/20 rounded-xl p-4 border border-white/20 shadow-sm">
                    <div className="text-2xl font-bold mb-1 tracking-tight">
                      {loading ? (
                        <div className="h-7 w-10 bg-white/30 rounded animate-pulse"></div>
                      ) : (
                        pastInterviews.length
                      )}
                    </div>
                    <div className="text-[10px] text-indigo-100 font-semibold uppercase tracking-wider">
                      Interviews Taken
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4 border border-white/20 shadow-sm">
                    <div className="text-2xl font-bold mb-1 tracking-tight">
                      {loading ? (
                        <div className="h-7 w-10 bg-white/30 rounded animate-pulse"></div>
                      ) : (
                        upcomingInterviews.length
                      )}
                    </div>
                    <div className="text-[10px] text-indigo-100 font-semibold uppercase tracking-wider">
                      Pending
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 border border-white/20 shadow-sm text-center">
                  <div className="text-3xl font-bold mb-1 tracking-tight">
                    {loading ? (
                      <div className="h-9 w-16 bg-white/30 rounded mx-auto animate-pulse"></div>
                    ) : (
                      `${calculateTotalHours(interviews)}h`
                    )}
                  </div>
                  <div className="text-[11px] text-indigo-100 font-semibold uppercase tracking-wider">
                    Total Hours Recorded
                  </div>
                </div>
              </div>
            </div>

            {/* Interview Guide */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 pb-3">
                <h3 className="text-base font-bold text-gray-900 mb-0">
                  Interview Guide
                </h3>
              </div>

              <div className="px-5 pb-5 space-y-3">
                {/* Guide Item 1 */}
                <div className="px-4 py-3.5 rounded-xl border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all cursor-pointer group shadow-sm bg-white">
                  <div className="flex items-center gap-3">
                    <div className="text-[#8492a6] group-hover:text-blue-500 transition-colors">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-gray-900 leading-tight mb-0.5">
                        Frontend Evaluation
                      </h4>
                      <p className="text-[11px] text-gray-500 font-semibold">
                        12 questions • Technical
                      </p>
                    </div>
                  </div>
                </div>

                {/* Guide Item 2 */}
                <div className="px-4 py-3.5 rounded-xl border border-gray-100 hover:border-pink-100 hover:shadow-sm transition-all cursor-pointer group shadow-sm bg-white">
                  <div className="flex items-center gap-3">
                    <div className="text-[#8492a6] group-hover:text-pink-500 transition-colors">
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-gray-900 leading-tight mb-0.5">
                        Culture Fit
                      </h4>
                      <p className="text-[11px] text-gray-500 font-semibold">
                        8 questions • Behavioral
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5">
                <button className="w-full py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm border-b-2">
                  View All Guides
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-indigo-50/30">
              <h2 className="text-xl font-bold text-gray-900">
                Schedule Interview
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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

            {/* Modal Body */}
            <form onSubmit={handleScheduleInterview} className="p-6 space-y-5">
              {/* Job Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Select Job Posting
                </label>
                <select
                  required
                  value={selectedJobId}
                  onChange={(e) => {
                    setSelectedJobId(e.target.value);
                    setSelectedApplicant(null);
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                >
                  <option value="">Choose a job...</option>
                  {jobs.map((job) => (
                    <option key={job._id} value={job._id}>
                      {job.jobTitle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Candidate Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Select Applicant
                </label>
                <select
                  required
                  disabled={!selectedJobId}
                  value={selectedApplicant?._id || ""}
                  onChange={(e) => {
                    const app = applicants.find(
                      (a) => a._id === e.target.value,
                    );
                    setSelectedApplicant(app);
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none disabled:opacity-50"
                >
                  <option value="">
                    {selectedJobId
                      ? "Choose an applicant..."
                      : "First select a job"}
                  </option>
                  {applicants.map((app) => (
                    <option key={app._id} value={app._id}>
                      {app.firstName ||
                        app.userName ||
                        app.email ||
                        "Unnamed Candidate"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={interviewData.date}
                    onChange={(e) =>
                      setInterviewData({
                        ...interviewData,
                        date: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={interviewData.time}
                    onChange={(e) =>
                      setInterviewData({
                        ...interviewData,
                        time: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={interviewData.endTime}
                    onChange={(e) =>
                      setInterviewData({
                        ...interviewData,
                        endTime: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
              </div>

              {/* Type & Link */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Interview Type
                  </label>
                  <select
                    value={interviewData.type}
                    onChange={(e) =>
                      setInterviewData({
                        ...interviewData,
                        type: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  >
                    <option value="Online">Online</option>
                    <option value="In-person">In-person</option>
                  </select>
                </div>
                {interviewData.type === "Online" && (
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                      Meeting Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={interviewData.link}
                      onChange={(e) =>
                        setInterviewData({
                          ...interviewData,
                          link: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={scheduling}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-[#5A45ED] hover:bg-[#4d3cd2] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {scheduling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Now"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* AI Chat Draggable Window */}
      {isChatOpen && (
        <div
          style={{
            left: `${chatPosition.x}px`,
            top: `${chatPosition.y}px`,
            position: "fixed",
          }}
          className={`z-[60] w-full max-w-[380px] h-[500px] bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col border border-gray-100 transition-shadow ${isDragging ? "shadow-blue-200 cursor-grabbing" : "shadow-2xl"}`}
        >
          {/* Chat Header (Draggable Handle) */}
          <div
            onMouseDown={handleMouseDown}
            className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-600 text-white cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="select-none">
                <h3 className="font-bold text-sm">AI Recruiter</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                  <span className="text-[10px] text-indigo-100">
                    Live Assistant
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] p-3 rounded-2xl shadow-sm text-sm ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isTyping}
                className="absolute right-1.5 top-1.5 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-md"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9-2-9-18-9 18 9 2zm0 0v-8"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Interviews;
