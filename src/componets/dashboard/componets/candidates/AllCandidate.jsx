import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import { getCandidateData } from "../../../../api/service/employerService";
import { toast } from "react-toastify";

const AllCandidate = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(10);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await getCandidateData();
      setCandidates(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = (candidate) => {
    if (candidate._id) {
      navigate(`/view-candidate-details/${candidate._id}`);
    }
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

  const getAvatarColor = (index) => {
    const colors = [
      "bg-[#EFE8E1] text-[#333333]",
      "bg-[#0F5A5A] text-white",
      "bg-indigo-100 text-indigo-700",
      "bg-emerald-100 text-emerald-700",
      "bg-pink-100 text-pink-700",
    ];
    return colors[index % colors.length];
  };

  // Filter Logic
  const filteredCandidates = candidates.filter((candidate) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    // Split query into words to support multi-skill search (e.g., "React Node")
    const searchTerms = query.split(/[\s,]+/).filter(Boolean);

    const name = (candidate.userName || "").toLowerCase();
    const role = (candidate.currentrole || "").toLowerCase();
    const city = (candidate.city || "").toLowerCase();
    const skills = (candidate.skills || []).map((s) => s.toLowerCase());

    // Every search term must match at least one field (AND logic across terms)
    return searchTerms.every(
      (term) =>
        name.includes(term) ||
        role.includes(term) ||
        city.includes(term) ||
        skills.some((skill) => skill.includes(term)),
    );
  });

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination Logic
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = filteredCandidates.slice(
    indexOfFirstCandidate,
    indexOfLastCandidate,
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Page Header */}
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-gray-900 leading-tight">
            All Candidates
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            View and manage candidate database
          </p>
        </div>

        {/* Filters/Sort Mock (to match aesthetics of typical robust lists, even if inactive currently) */}
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-gray-100">
          <div className="relative w-full max-w-md">
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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
              placeholder="Search candidates by name, role, skills, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter
            </button>
          </div>
        </div>

        {/* Candidates Cards Layout */}
        <div className="space-y-4">
          {currentCandidates.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-medium">
                No candidates found in the database.
              </p>
            </div>
          ) : (
            currentCandidates.map((candidate, index) => {
              // Calculate actual index based on pagination so colors/badges remain consistent
              const actualIndex = indexOfFirstCandidate + index;
              return (
                <div
                  key={candidate._id || actualIndex}
                  className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5"
                >
                  {/* Left: Avatar */}
                  <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-sm ${getAvatarColor(actualIndex)}`}
                  >
                    {getInitials(candidate.userName)}
                  </div>

                  {/* Middle: Content */}
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className="text-[17px] font-bold text-gray-900 leading-tight">
                        {candidate.userName || "Unknown Candidate"}
                      </h3>

                      {/* Badges mapped loosely to pattern seen in screenshot */}
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50/80 text-orange-600 border border-orange-100 text-[11px] font-bold shadow-sm">
                        <svg
                          className="w-3 h-3 text-orange-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Premium
                      </span>

                      {actualIndex % 2 === 0 ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[11px] font-bold shadow-sm">
                          New
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200 text-[11px] font-bold shadow-sm">
                          Screening
                        </span>
                      )}
                    </div>

                    <p className="text-[#64748B] text-[15px] font-medium mb-2.5">
                      {candidate.currentrole || "Candidate Context Unavailable"}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[#8492a6] text-sm font-medium mb-3.5">
                      <span className="flex items-center gap-1.5">
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
                      </span>
                      <span className="flex items-center gap-1.5">
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
                          ? `${candidate.totalExperience} ${candidate.totalExperience.includes("year") ? "" : "years"}`
                          : "0 years"}
                      </span>
                    </div>

                    {/* Skills array rendering mapped to pill shapes */}
                    <div className="flex flex-wrap items-center gap-2">
                      {candidate.skills && candidate.skills.length > 0 && (
                        <>
                          {candidate.skills.slice(0, 4).map((skill, sIndex) => (
                            <span
                              key={sIndex}
                              className="bg-[#F8FAFC] text-[#475569] text-[11px] font-bold px-3 py-1.5 rounded-md border border-gray-100"
                            >
                              {skill.substring(0, 20)}
                              {skill.length > 20 ? "..." : ""}
                            </span>
                          ))}
                          {candidate.skills.length > 4 && (
                            <span className="text-gray-400 text-[11px] font-semibold ml-1">
                              +{candidate.skills.length - 4} more
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col items-end justify-between min-w-[120px] mt-4 sm:mt-0">
                    <div className="flex items-center gap-3.5 text-gray-400 mb-6 sm:mb-0">
                      <button
                        className="hover:text-amber-500 transition-colors p-1"
                        title="Favorite"
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
                            strokeWidth={1.5}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </button>
                      <button
                        className="hover:text-indigo-500 transition-colors p-1"
                        title="Download Resume"
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
                            strokeWidth={1.5}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </button>
                      <button
                        className="hover:text-emerald-500 transition-colors p-1"
                        title="Chat"
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
                            strokeWidth={1.5}
                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                          />
                        </svg>
                      </button>
                    </div>

                    <button
                      onClick={() => handleViewMore(candidate)}
                      className="bg-[#5A45ED] hover:bg-[#4d3cd2] text-white px-5 py-2 rounded-lg text-[13px] font-bold transition-colors w-full sm:w-auto shadow-sm"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        {filteredCandidates.length > candidatesPerPage && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-xl mt-6 shadow-sm">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-semibold">
                    {indexOfFirstCandidate + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold">
                    {Math.min(indexOfLastCandidate, filteredCandidates.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold">
                    {filteredCandidates.length}
                  </span>{" "}
                  candidates
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Page Numbers */}
                  {[
                    ...Array(
                      Math.ceil(filteredCandidates.length / candidatesPerPage),
                    ).keys(),
                  ].map((number) => {
                    const pageNum = number + 1;
                    // Logic to show a limited number of pagination buttons (e.g., current, adjacent, ends)
                    if (
                      pageNum === 1 ||
                      pageNum ===
                        Math.ceil(
                          filteredCandidates.length / candidatesPerPage,
                        ) ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 ${
                            currentPage === pageNum
                              ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      // Render an ellipsis if there's a gap
                      return (
                        <span
                          key={`ellipsis-${pageNum}`}
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={
                      currentPage ===
                      Math.ceil(filteredCandidates.length / candidatesPerPage)
                    }
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                      currentPage ===
                      Math.ceil(candidates.length / candidatesPerPage)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AllCandidate;
