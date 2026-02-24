import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { getSuggestedCandidates } from "../../../../api/service/employerService";
import { useNavigate } from "react-router-dom";

const Suggested = () => {
  const employerId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getSuggestedCandidates(employerId);
        // Ensure data is array
        const fetchedData = response?.data?.data || [];
        // Sort them by aiScore descending to surface the best matches first
        const sorted = [...fetchedData].sort(
          (a, b) => (b.aiScore || 0) - (a.aiScore || 0),
        );
        setCandidates(sorted);
      } catch (err) {
        console.error("Failed to fetch suggested candidates", err);
      } finally {
        setLoading(false);
      }
    };
    if (employerId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [employerId]);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarColor = (index) => {
    const colors = [
      "bg-[#EF4444]", // Red
      "bg-[#475569]", // Slate
      "bg-[#0EA5E9]", // Light Blue
      "bg-[#10B981]", // Emerald
      "bg-[#F59E0B]", // Amber
      "bg-[#8B5CF6]", // Violet
    ];
    return colors[index % colors.length];
  };

  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-yellow-400">⚡</span> Suggested Candidates
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            AI-powered recommendations based on your open job postings.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <div className="relative flex-grow w-full">
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
              placeholder="Search suggestions..."
              className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 text-sm"
            />
          </div>

          <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>

          <div className="flex items-center gap-3 w-full sm:w-auto p-1">
            <select className="bg-transparent border border-gray-200 text-gray-600 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-36 p-2 cursor-pointer outline-none">
              <option>All Roles</option>
              <option>Full Stack Developer</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
            </select>

            <button className="flex-shrink-0 p-2.5 bg-white border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm mt-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600 font-medium">
              Please wait, the new records are loading...
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Our AI is fetching the best matches for your roles
            </p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium">
              No suggested candidates found.
            </p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate, index) => {
              // Extract mismatch string to sentences
              const reasons = candidate.aiMatchReason
                ? candidate.aiMatchReason
                    .split(". ")
                    .filter((r) => r.trim() !== "")
                : ["Strong match for this role"];

              // Fix percentage color based on value
              const matchScore = candidate.aiScore || 0;
              let scoreColor = "text-emerald-500";
              if (matchScore < 50) scoreColor = "text-red-500";
              else if (matchScore < 75) scoreColor = "text-yellow-500";

              return (
                <div
                  key={candidate._id || index}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  {/* Top section: Avatar, Info, Score */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() =>
                        navigate(`/view-candidate-details/${candidate._id}`)
                      }
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex flex-shrink-0 items-center justify-center text-white text-lg font-semibold ${getAvatarColor(
                          index,
                        )} transition-transform group-hover:scale-105`}
                      >
                        {getInitials(candidate.userName)}
                      </div>
                      <div className="max-w-[120px] sm:max-w-[140px] md:max-w-full">
                        <h3 className="font-bold text-gray-900 text-[15px] leading-tight flex items-center gap-1 truncate w-full group-hover:text-indigo-600 transition-colors">
                          {candidate.userName || "Unknown"}
                          {candidate.subscriptionActive && (
                            <svg
                              className="w-3.5 h-3.5 text-blue-500 flex-shrink-0"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </h3>
                        <p className="text-gray-500 text-[13px] truncate w-full">
                          {candidate.currentrole || "Candidate"}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`font-bold text-[15px] ${scoreColor} flex-shrink-0`}
                    >
                      {matchScore}%{" "}
                      <span className="font-medium text-[12px]">Match</span>
                    </div>
                  </div>

                  {/* Details section */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-500 text-[13px]">
                      <svg
                        className="w-4 h-4 opacity-70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {candidate.city || "Remote"}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-[13px]">
                      <svg
                        className="w-4 h-4 opacity-70"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {candidate.totalExperience
                        ? `${candidate.totalExperience} ${candidate.totalExperience.toString().includes("year") ? "" : "years "}Experience`
                        : "0 years Experience"}
                    </div>
                  </div>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap items-center gap-2 mb-5 h-[28px] overflow-hidden">
                    {candidate.skills && candidate.skills.length > 0 ? (
                      <>
                        {candidate.skills.slice(0, 3).map((skill, sIndex) => (
                          <span
                            key={sIndex}
                            className="bg-[#F8FAFC] text-[#475569] border border-gray-100 text-[11px] font-medium px-2 py-1 rounded-md max-w-[120px] truncate"
                          >
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 3 && (
                          <span className="bg-[#F8FAFC] text-[#475569] border border-gray-100 text-[11px] font-medium px-2 py-1 rounded-md flex-shrink-0">
                            +{candidate.skills.length - 3}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-400 text-[11px] italic">
                        No skills listed
                      </span>
                    )}
                  </div>

                  {/* Match Reasons - The purple box */}
                  <div className="bg-indigo-50/50 rounded-xl p-4 mb-5 flex-grow">
                    <h4 className="text-indigo-900 text-[10px] font-bold tracking-wider uppercase mb-2">
                      Why they're a match
                    </h4>
                    <ul className="space-y-1.5">
                      {reasons.slice(0, 3).map((reason, rIndex) => (
                        <li
                          key={rIndex}
                          className="flex items-start gap-2 text-[12px] text-indigo-900/80"
                        >
                          <svg
                            className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-[1px]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="leading-tight">
                            {reason}
                            {!reason.endsWith(".") && "."}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-2 mt-auto">
                    <button className="flex items-center justify-center gap-1.5 flex-[0.8] bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-[13px] font-medium hover:bg-gray-50 transition-colors">
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
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                      Save
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/view-candidate-details/${candidate._id}`)
                      }
                      className="flex items-center justify-center gap-1.5 flex-[1.2] bg-indigo-600 text-white py-2 rounded-lg text-[13px] font-medium hover:bg-indigo-700 transition-colors shadow-sm"
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
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418-4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      Contact
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Suggested;
