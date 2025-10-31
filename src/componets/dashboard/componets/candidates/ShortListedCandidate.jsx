import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import {
  getCandidateData,
  getShortListedCandidateData,
} from "../../../../api/service/employerService";
import { toast } from "react-toastify";

const ShortListedCandidate = () => {
  const employerId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

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
                  c.candidate?.employApplicantStatus === "Interview Scheduled"
              ).length
            }
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Offer Received</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {
              candidates.filter(
                (c) => c.candidate?.employApplicantStatus === "Offer Received"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sl No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Candidate Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {candidates.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No shortlisted candidates found
                  </td>
                </tr>
              ) : (
                candidates.map((item, index) => (
                  <tr
                    key={item.candidate?.applicantId || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">
                        {item.candidate?.firstName || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 font-medium">
                        {item.jobTitle || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">
                        {item.companyName || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">
                        {item.location || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                        {item.candidate?.employApplicantStatus || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">
                        {item.candidate?.appliedDate
                          ? new Date(
                              item.candidate.appliedDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleViewCandidate(item.candidate?.applicantId)
                          }
                          className="text-purple-600 hover:text-purple-800 transition-colors font-medium text-sm"
                        >
                          View Candidate
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleViewJob(item.jobId)}
                          className="text-blue-600 hover:text-blue-800 transition-colors font-medium text-sm"
                        >
                          View Job
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default ShortListedCandidate;
