import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import MainLayout from "../../layout/MainLayout";
import { getCandidateDetails } from "../../../../api/service/employerService";
import accountImg from "../../../../../public/assets/images/profileImage.png";

const InterViewSheduledCandidate = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidateDetails();
  }, [candidateId]);

  const fetchCandidateDetails = async () => {
    try {
      setLoading(true);
      const response = await getCandidateDetails(candidateId);
      setCandidate(response.data.data);
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      toast.error("Failed to fetch candidate details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDownloadResume = () => {
    if (candidate?.resume?.url) {
      window.open(candidate.resume.url, "_blank");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading candidate details...</div>
        </div>
      </MainLayout>
    );
  }

  if (!candidate) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Candidate not found</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Candidates
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Header Background */}
          <div className="h-40 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800"></div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between -mt-20">
              {/* Left Section: Profile Picture & Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
                {/* Profile Picture */}
                <div className="relative">
                  {candidate.userProfilePic?.url ? (
                    <img
                      src={accountImg}
                      alt={candidate.userName}
                      className="w-40 h-40 rounded-2xl border-4 border-white shadow-xl object-cover bg-white"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-2xl border-4 border-white shadow-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-5xl font-bold text-white">
                        {candidate.userName?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  <div
                    className={`absolute bottom-3 right-3 w-8 h-8 rounded-full border-4 border-white ${
                      candidate.isAvailable ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                </div>

                {/* Name & Role */}
                <div className="text-center sm:text-left pb-2">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {candidate.userName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                    <span className="px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                      {candidate.currentrole || "Job Seeker"}
                    </span>
                    {candidate.isAvailable && (
                      <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        Available
                      </span>
                    )}
                  </div>
                  {candidate.specialization && (
                    <p className="text-gray-600 mt-2">
                      <span className="font-medium">Specialization:</span>{" "}
                      {candidate.specialization}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Section: Action Button */}
              <div className="mt-6 lg:mt-0 flex justify-center lg:justify-end">
                {candidate.resume?.url && (
                  <button
                    onClick={handleDownloadResume}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold"
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
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download Resume
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <svg
                  className="w-7 h-7 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Email Address
                </p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {candidate.userEmail}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-green-50 p-4 rounded-xl">
                <svg
                  className="w-7 h-7 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Phone Number
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {candidate.userMobile}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 p-4 rounded-xl">
                <svg
                  className="w-7 h-7 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Current Location
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {candidate.currentCity || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Summary */}
            {candidate.profilesummary && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                  About Me
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {candidate.profilesummary}
                </p>
              </div>
            )}

            {/* Work Experience */}
            {candidate.workExperience &&
              candidate.workExperience.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                    Work Experience
                  </h2>
                  <div className="space-y-6">
                    {candidate.workExperience.map((exp, index) => (
                      <div key={exp._id || index} className="relative pl-8">
                        <div className="absolute left-0 top-1 w-3 h-3 bg-purple-600 rounded-full"></div>
                        {index !== candidate.workExperience.length - 1 && (
                          <div className="absolute left-1.5 top-4 w-0.5 h-full bg-purple-200"></div>
                        )}
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {exp.position}
                          </h3>
                          <p className="text-purple-700 font-semibold mt-1">
                            {exp.company}
                          </p>
                          <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {formatDate(exp.startDate)} -{" "}
                            {exp.endDate ? formatDate(exp.endDate) : "Present"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Education */}
            {candidate.education && candidate.education.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                  Education
                </h2>
                <div className="space-y-6">
                  {candidate.education.map((edu, index) => (
                    <div key={edu._id || index} className="relative pl-8">
                      <div className="absolute left-0 top-1 w-3 h-3 bg-green-600 rounded-full"></div>
                      {index !== candidate.education.length - 1 && (
                        <div className="absolute left-1.5 top-4 w-0.5 h-full bg-green-200"></div>
                      )}
                      <div className="bg-green-50 rounded-lg p-4">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {edu.degree}
                        </h3>
                        <p className="text-green-700 font-semibold mt-1">
                          {edu.institution}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
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
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                            {edu.type}
                          </span>
                          <span className="flex items-center gap-1">
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
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {formatDate(edu.startDate)} -{" "}
                            {formatDate(edu.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-3">
                  {candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-lg text-sm font-semibold hover:shadow-md transition-shadow"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-lg font-bold mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-purple-100">Experience</span>
                  <span className="font-bold text-lg">
                    {candidate.totalExperience
                      ? `${candidate.totalExperience} yrs`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-100">Expected Salary</span>
                  <span className="font-bold text-lg">
                    {candidate.expectedSalary
                      ? `₹${(candidate.expectedSalary / 1000).toFixed(0)}K`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-100">Availability</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      candidate.isAvailable
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {candidate.isAvailable ? "Open" : "Not Open"}
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-purple-600 rounded-full"></div>
                Personal Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Date of Birth</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatDate(candidate.dob)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Gender</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {candidate.gender || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Marital Status</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {candidate.maritalStatus || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">
                    Preferred Location
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {candidate.preferredLocation || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Languages */}
            {candidate.languages && candidate.languages.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-1 h-5 bg-purple-600 rounded-full"></div>
                  Languages
                </h2>
                <div className="flex flex-wrap gap-2">
                  {candidate.languages.map((language, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-purple-600 rounded-full"></div>
                Connect
              </h2>
              <div className="space-y-3">
                {candidate.linkedin && (
                  <a
                    href={candidate.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span className="font-medium">LinkedIn</span>
                  </a>
                )}
                {candidate.github && (
                  <a
                    href={candidate.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span className="font-medium">GitHub</span>
                  </a>
                )}
                {candidate.portfolio && (
                  <a
                    href={candidate.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
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
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                    <span className="font-medium">Portfolio</span>
                  </a>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 bg-purple-600 rounded-full"></div>
                Address
              </h2>
              <div className="text-sm text-gray-700 leading-relaxed space-y-1">
                <p className="font-medium">{candidate.addressLine1}</p>
                {candidate.addressLine2 && <p>{candidate.addressLine2}</p>}
                <p>
                  {candidate.city}, {candidate.state}
                </p>
                <p className="font-semibold text-gray-900">
                  PIN: {candidate.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default InterViewSheduledCandidate;
