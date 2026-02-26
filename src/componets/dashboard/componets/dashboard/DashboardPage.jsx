import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { getDashboardData } from "../../../../api/service/employerService";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const employerId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    activeJobCount: 0,
    totalApplicationCount: 0,
    hiredCount: 0,
    recentApplication: null,
  });

  const savedData = localStorage.getItem("employerData");
  const employerData = savedData ? JSON.parse(savedData) : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!employerId) return;
        const response = await getDashboardData(employerId);
        if (response?.data?.data) {
          setDashboardData(response.data.data);
        } else if (response?.data) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
    fetchData();
  }, [employerId]);

  const recentApps = dashboardData.recentApplication
    ? Array.isArray(dashboardData.recentApplication)
      ? dashboardData.recentApplication
      : [dashboardData.recentApplication]
    : [];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, {employerData?.companyName || "Employer"}
            </h2>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Overview of your hiring pipeline and active jobs.
            </p>
          </div>
          <button
            onClick={() => navigate("/post-new-job")}
            className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            Post New Job
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Active Jobs */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Active Jobs
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
                  {dashboardData.activeJobCount}
                </h3>
              </div>
            </div>
          </div>

          {/* Total Applicants */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Total Applicants
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
                  {dashboardData.totalApplicationCount}
                </h3>
              </div>
            </div>
          </div>

          {/* Unread Messages */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shadow-inner">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Unread Messages
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
                  0
                </h3>
              </div>
            </div>
          </div>

          {/* Hired This Month */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Hired This Month
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
                  {dashboardData.hiredCount}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Applicants */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Recent Applicants
                <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full font-bold">
                  {recentApps.length}
                </span>
              </h3>
              <button
                onClick={() => navigate("/all-job-list")}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View All
              </button>
            </div>

            {/* View for Desktop (Table) */}
            <div className="hidden sm:block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 font-semibold text-slate-500">
                      <th className="px-6 py-4">Candidate</th>
                      <th className="px-6 py-4">Applied For</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApps.length > 0 ? (
                      recentApps.map((app, index) => (
                        <tr
                          key={index}
                          className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-5">
                            <span className="font-bold text-slate-900">
                              {app.candidate?.firstName || "Unknown"}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-slate-800 font-medium">
                              {app.jobTitle}
                            </div>
                            {app.jobId && (
                              <div className="text-[10px] text-slate-400 mt-0.5 tracking-tight uppercase">
                                ID: {app.jobId}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-5">
                            <div className="text-slate-600">
                              {new Date(app.appliedDate).toLocaleDateString()}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5 uppercase">
                              {new Date(app.appliedDate).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                                app.candidate?.employApplicantStatus ===
                                "Selected"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : app.candidate?.employApplicantStatus ===
                                      "Rejected"
                                    ? "bg-red-100 text-red-700"
                                    : (app.candidate?.employApplicantStatus ||
                                          app.candidate?.status) === "Applied"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {app.candidate?.employApplicantStatus ||
                                app.candidate?.status ||
                                "Applied"}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <button
                              onClick={() =>
                                navigate(`/preview-job/${app._id}`)
                              }
                              className="px-4 py-1.5 bg-slate-100 text-slate-700 hover:bg-indigo-600 hover:text-white rounded-lg font-bold text-xs transition-all active:scale-95"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-12 text-center text-slate-400"
                        >
                          No applicants yet. Post a job to get started!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* View for Mobile (Cards) */}
            <div className="sm:hidden space-y-4 pb-20">
              {recentApps.length > 0 ? (
                recentApps.map((app, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                          {app.candidate?.firstName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">
                            {app.candidate?.firstName || "Unknown"}
                          </h4>
                          <p className="text-xs text-slate-500">
                            Applied{" "}
                            {new Date(app.appliedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          app.candidate?.employApplicantStatus === "Selected"
                            ? "bg-emerald-100 text-emerald-700"
                            : app.candidate?.employApplicantStatus ===
                                "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {app.candidate?.employApplicantStatus || "Applied"}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                        Applied For
                      </p>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">
                        {app.jobTitle}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/preview-job/${app._id}`)}
                      className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                    >
                      Review Application
                    </button>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center text-slate-400">
                  No applicants yet.
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 grid gap-2">
              <button
                onClick={() => navigate("/post-new-job")}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
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
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Post a Job
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Create a new job listing
                  </p>
                </div>
              </button>

              <button
                onClick={() => navigate("/all-candidates-list")}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
              >
                <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center flex-shrink-0 text-pink-600">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Search Candidates
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Find talent directly
                  </p>
                </div>
              </button>

              <button
                onClick={() => navigate("/analytics")}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
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
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    View Analytics
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Check performance stats
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
