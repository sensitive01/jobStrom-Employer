import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MainLayout from "../../../layout/MainLayout";
import {
  disableJobStatus,
  getActiveJobPosted,
  getJobCountExceeded,
} from "../../../../../api/service/employerService";

const ActiveJobs = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const hasCheckedJobLimit = useRef(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await getActiveJobPosted(userId);
        setJobs(response.data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    const isJobListPostExeeded = async () => {
      try {
        const response = await getJobCountExceeded(userId);
        if (response.status === 200) {
          const { canPost, message } = response.data;
          if (!canPost) {
            toast.info(message);
          }
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Error checking job limit");
      }
    };

    fetchJobs();

    if (!hasCheckedJobLimit.current) {
      isJobListPostExeeded();
      hasCheckedJobLimit.current = true;
    }
  }, [userId]);

  const handlePreviewJob = (job) => {
    navigate(`/preview-job/${job._id}`);
  };

  const handleEditJob = (jobId) => {
    navigate(`/edit-job/${jobId}`);
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;

    try {
      const response = await disableJobStatus(jobToDelete._id, userId);

      if (response.status === 200) {
        setJobs(
          jobs.map((job) =>
            job._id === jobToDelete._id
              ? { ...job, isActive: !job.isActive }
              : job,
          ),
        );
        toast.success(response.data.message);
        setShowDeleteModal(false);
        setJobToDelete(null);
      } else {
        toast.error(
          response.response.data.message || "Failed to update job status",
        );
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("An error occurred while updating the job");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setJobToDelete(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          {/* Enhanced Premium Loader */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
              Monitoring Live Feeds
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
            Active Postings
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Currently live and accepting new applications
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 group hover:border-indigo-100 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-indigo-50 rounded-xl group-hover:bg-indigo-600 transition-colors">
              <svg
                className="w-5 h-5 text-indigo-600 group-hover:text-white"
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
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full">
              Total
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 leading-none">
            {jobs.length}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 ml-0.5">
            Total Active Jobs
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 group hover:border-emerald-100 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-50 rounded-xl group-hover:bg-emerald-600 transition-colors">
              <svg
                className="w-5 h-5 text-emerald-600 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full">
              Open
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 leading-none">
            {jobs.filter((j) => j.isActive && j.status === "open").length}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 ml-0.5">
            Verified Listings
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 group hover:border-amber-100 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-50 rounded-xl group-hover:bg-amber-600 transition-colors">
              <svg
                className="w-5 h-5 text-amber-600 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full">
              Activity
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 leading-none">
            {jobs.reduce(
              (sum, job) => sum + (job.applications?.length || 0),
              0,
            )}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 ml-0.5">
            Total Applications
          </p>
        </div>
      </div>

      {/* Jobs Table/Cards */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white/50">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
            Active Overviews
          </h3>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Real-time updates
            </span>
          </div>
        </div>

        {/* Desktop View (Table) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Sl
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Job Reference
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Position & Company
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Applicants
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Posted On
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {jobs.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]"
                  >
                    No active jobs found
                  </td>
                </tr>
              ) : (
                jobs.map((job, index) => (
                  <tr
                    key={job._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 text-slate-400 font-mono text-[10px] text-center border-r border-slate-50/50">
                      {(index + 1).toString().padStart(2, "0")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg uppercase tracking-wider border border-slate-100 group-hover:bg-white group-hover:text-slate-600 transition-colors">
                        {job.jobId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase text-xs tracking-tight">
                        {job.jobTitle}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">
                        {job.companyName}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[32px] h-8 rounded-xl bg-indigo-50 text-indigo-700 text-[10px] font-black border border-indigo-100 px-2">
                        {job.applications?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 text-[9px] font-black uppercase rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-100">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handlePreviewJob(job)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"
                          title="Preview"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditJob(job._id)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-all border border-transparent hover:border-amber-100"
                          title="Edit"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(job)}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                          title="Deactivate"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View (Cards) */}
        <div className="sm:hidden divide-y divide-slate-50">
          {jobs.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              No active jobs found
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job._id}
                className="p-5 space-y-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-[9px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded uppercase border border-slate-100">
                        {job.jobId}
                      </span>
                      <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-100">
                        Active
                      </span>
                    </div>
                    <h3 className="font-black text-slate-900 leading-tight truncate uppercase text-[11px] tracking-tight group-hover:text-indigo-600 transition-colors">
                      {job.jobTitle}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">
                      {job.companyName}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 bg-indigo-50 rounded-xl border border-indigo-100 min-w-[54px] group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-300">
                    <span className="text-xs font-black text-indigo-700 leading-none group-hover:text-white">
                      {job.applications?.length || 0}
                    </span>
                    <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-tighter mt-1 group-hover:text-white/80">
                      Apps
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-50 border-dashed">
                  <button
                    onClick={() => handlePreviewJob(job)}
                    className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 uppercase tracking-widest"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEditJob(job._id)}
                    className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black hover:bg-slate-50 transition-all uppercase tracking-widest"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(job)}
                    className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 hover:bg-rose-100 transition-all"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showDeleteModal && jobToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={handleCancelDelete}
          ></div>
          <div className="relative bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl border border-slate-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <svg
                  className="w-8 h-8 text-rose-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                Change Status?
              </h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                Status change required
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100">
              <p className="font-black text-slate-900 text-xs uppercase tracking-tight truncate">
                {jobToDelete.jobTitle}
              </p>
              <p className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-widest">
                {jobToDelete.jobId}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmDelete}
                className="w-full py-3.5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                Confirm Update
              </button>
              <button
                onClick={handleCancelDelete}
                className="w-full py-3.5 text-slate-400 hover:text-slate-900 transition-colors text-xs font-black uppercase tracking-widest"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ActiveJobs;
