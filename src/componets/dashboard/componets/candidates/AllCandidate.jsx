import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import { getCandidateData } from "../../../../api/service/employerService";
import { toast } from "react-toastify";

const AllCandidate = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await getCandidateData();
      setCandidates(response.data.data || []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = (candidate) => {
    navigate(`/employer/view-candidate-details/${candidate._id}`);
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
        <h2 className="text-2xl font-bold text-gray-800">All Candidates</h2>
        <p className="text-gray-600">View and manage candidate database</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Total Candidates</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {candidates.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">With Contact Info</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {candidates.filter((c) => c.userEmail && c.userMobile).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">With Current Role</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {candidates.filter((c) => c.currentrole).length}
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
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Mobile
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Current Role
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
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No candidates found
                  </td>
                </tr>
              ) : (
                candidates.map((candidate, index) => (
                  <tr
                    key={candidate._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">
                        {candidate.userName || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">
                        {candidate.userEmail || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">
                        {candidate.userMobile || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">
                        {candidate.currentrole || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewMore(candidate)}
                        className="text-purple-600 hover:text-purple-800 transition-colors font-medium text-sm"
                      >
                        View More
                      </button>
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

export default AllCandidate;
