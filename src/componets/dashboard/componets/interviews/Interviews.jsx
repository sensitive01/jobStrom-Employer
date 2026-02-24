import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { getInterviewDetails } from "../../../../api/service/employerService";

const Interviews = () => {
  const employerId = localStorage.getItem("userId");
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getInterviewDetails(employerId);
        // Extract array from response based on the logged JSON structure
        if (response?.data?.success && response?.data?.data) {
          setInterviews(response.data.data);
        } else if (response?.data) {
          setInterviews(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.error("Error fetching interviews:", error);
      } finally {
        setLoading(false);
      }
    };
    if (employerId) fetchData();
  }, [employerId]);

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
            <button className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg font-semibold transition-colors border border-yellow-200 shadow-sm text-sm">
              <svg
                className="w-4 h-4 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              AI Question Gen
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#5A45ED] hover:bg-[#4d3cd2] text-white rounded-lg font-semibold transition-colors shadow-sm text-sm">
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
                        <div className="flex items-center gap-1 ml-auto">
                          <button className="text-gray-400 hover:text-indigo-500 p-1.5 transition-colors rounded-md hover:bg-gray-50">
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
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                          </button>
                          <button className="text-gray-400 hover:text-gray-700 p-1.5 transition-colors rounded-md hover:bg-gray-50">
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
                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                              />
                            </svg>
                          </button>
                        </div>
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

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/20 rounded-xl p-4 border border-white/20 shadow-sm">
                    <div className="text-3xl font-bold mb-1 tracking-tight">
                      {loading ? (
                        <div className="h-9 w-12 bg-white/30 rounded animate-pulse"></div>
                      ) : (
                        interviews.length
                      )}
                    </div>
                    <div className="text-[11px] text-indigo-100 font-semibold uppercase tracking-wider">
                      Interviews
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-xl p-4 border border-white/20 shadow-sm">
                    <div className="text-3xl font-bold mb-1 tracking-tight">
                      {loading ? (
                        <div className="h-9 w-16 bg-white/30 rounded animate-pulse"></div>
                      ) : (
                        `${interviews.length * 1.5}h`
                      )}
                    </div>
                    <div className="text-[11px] text-indigo-100 font-semibold uppercase tracking-wider">
                      Total Time
                    </div>
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
    </MainLayout>
  );
};

export default Interviews;
