import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import { getShortListedCandidateData } from "../../../../api/service/employerService";
import { toast } from "react-toastify";

const ShortListedCandidate = () => {
  const employerId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await getShortListedCandidateData(employerId);
        setCandidates(response.data.data || []);
      } catch (error) {
        console.error("Error fetching candidates:", error);
        toast.error("Failed to fetch candidates");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, [employerId]);

  // Removed fetchCandidates from top level as it is now inside useEffect

  const handleViewCandidate = (applicantId) => {
    navigate(`/view-candidate-details/${applicantId}`);
  };

  const handleViewJob = (jobId) => {
    navigate(`/preview-job/${jobId}`);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading candidates...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Shortlisted Candidates
        </h2>
        <p className="text-gray-600">
          View and manage shortlisted candidates for your job postings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Total Shortlisted</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {candidates.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Interview Scheduled</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {
              candidates.filter(
                (c) =>
                  c.candidate?.employApplicantStatus === "Interview Scheduled",
              ).length
            }
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Offer Received</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {
              candidates.filter(
                (c) => c.candidate?.employApplicantStatus === "Offer Received",
              ).length
            }
          </p>
        </div>
      </div>

      {/* Candidates Table/Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Desktop View (Table) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Sl No
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {candidates.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No shortlisted candidates found
                  </td>
                </tr>
              ) : (
                candidates.map((item, index) => (
                  <tr
                    key={item.candidate?.applicantId || index}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">
                        {item.candidate?.firstName || "N/A"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {item.candidate?.applicantId || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-700">
                        {item.jobTitle || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">
                        {item.companyName || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">
                        {item.location || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {item.candidate?.employApplicantStatus || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() =>
                            handleViewCandidate(item.candidate?.applicantId)
                          }
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="View Candidate"
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleViewJob(item.jobId)}
                          className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                          title="View Job"
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
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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
          {candidates.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              No shortlisted candidates found
            </div>
          ) : (
            candidates.map((item, index) => (
              <div
                key={item.candidate?.applicantId || index}
                className="p-5 space-y-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">
                      {item.candidate?.firstName || "N/A"}
                    </h3>
                    <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                      {item.jobTitle || "N/A"}
                    </p>
                  </div>
                  <span className="inline-flex px-2 py-1 text-[9px] font-bold uppercase rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                    {item.candidate?.employApplicantStatus || "N/A"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">
                      Company
                    </p>
                    <p className="text-xs font-semibold text-slate-700">
                      {item.companyName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">
                      Location
                    </p>
                    <p className="text-xs font-semibold text-slate-700">
                      {item.location || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() =>
                      handleViewCandidate(item.candidate?.applicantId)
                    }
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    View Candidate
                  </button>
                  <button
                    onClick={() => handleViewJob(item.jobId)}
                    className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                  >
                    View Job
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ShortListedCandidate;
