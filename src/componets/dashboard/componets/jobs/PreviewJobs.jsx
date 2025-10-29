import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCandidateDetails,
  getJobDetails,
  updateJobApplicationStatus,
} from "../../../../api/service/employerService";
import MainLayout from "../../layout/MainLayout";

// API Configuration
const API_BASE_URL =
  import.meta.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const JobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View toggle
  const [activeTab, setActiveTab] = useState("applicants");

  // Candidate details modal state
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [loadingCandidate, setLoadingCandidate] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);

  // Filter state
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Interview modal state
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");

  useEffect(() => {
    fetchJobApplications();
  }, [jobId]);

  // Fetch job and applications
  const fetchJobApplications = async () => {
    try {
      setLoading(true);
      const response = await getJobDetails(jobId);

      if (response.status === 200) {
        setJob(response.data);
        setApplications(response.data.applications || []);
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching job applications:", error);
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  // Fetch candidate details from API
  const fetchCandidateDetails = async (candidateId) => {
    try {
      setLoadingCandidate(true);
      const response = await getCandidateDetails(candidateId);

      if (response.status === 200) {
        setCandidateDetails(response.data);
      }
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      setCandidateDetails(null);
    } finally {
      setLoadingCandidate(false);
    }
  };

  // Open candidate details modal
  const openCandidateModal = (application) => {
    setSelectedCandidate(application);
    setShowCandidateModal(true);
    fetchCandidateDetails(application.applicantId);
  };

  // Close candidate modal
  const closeCandidateModal = () => {
    setShowCandidateModal(false);
    setTimeout(() => {
      setSelectedCandidate(null);
      setCandidateDetails(null);
    }, 300);
  };

  // Update application status
  const updateApplicationStatus = async (
    applicationId,
    newStatus,
    additionalData = {}
  ) => {
    try {
      const token = getAuthToken();

      const response = await updateJobApplicationStatus(jobId,applicationId,newStatus,additionalData)
      
      
    

    

      // if (selectedCandidate && selectedCandidate._id === applicationId) {
      //   setSelectedCandidate((prev) => ({
      //     ...prev,
      //     employApplicantStatus: newStatus,
      //   }));
      // }

      // return true;
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update application status");
      return false;
    }
  };

  // Status update handlers
  const handleStatusChange = async (status) => {
    const statusMessages = {
      "Under Review": "mark as under review",
      Shortlisted: "shortlist",
      "Interview Scheduled": "schedule interview for",
      Selected: "select",
      "Offer Received": "send offer to",
      Rejected: "reject",
    };

    if (status === "Interview Scheduled") {
      setShowInterviewModal(true);
      return;
    }

    const confirmMessage = `Are you sure you want to ${statusMessages[status]} ${selectedCandidate.firstName}?`;

    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    const success = await updateApplicationStatus(
      selectedCandidate._id,
      status
    );

    if (success) {
      const successMessages = {
        "Under Review": "Application is now under review",
        Shortlisted: "Candidate has been shortlisted!",
        Selected: "Candidate has been selected!",
        "Offer Received": "Offer has been sent to candidate!",
        Rejected: "Application has been rejected",
      };

      alert(`✅ ${successMessages[status]}`);
    }
  };

  // Schedule interview
  const submitInterview = async () => {
    if (!interviewDate || !interviewTime) {
      alert("Please select date and time for the interview");
      return;
    }

    const success = await updateApplicationStatus(
      selectedCandidate._id,
      "Interview Scheduled",
      {
        interviewDate,
        interviewTime,
        interviewNotes,
      }
    );

    if (success) {
      setShowInterviewModal(false);
      setInterviewDate("");
      setInterviewTime("");
      setInterviewNotes("");
      alert(
        `✅ Interview scheduled for ${selectedCandidate.firstName} on ${interviewDate} at ${interviewTime}`
      );
    }
  };

  // Download resume
  const downloadResume = (resumeUrl) => {
    window.open(resumeUrl, "_blank");
  };

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesStatus =
      filterStatus === "all" ||
      app.employApplicantStatus?.toLowerCase() === filterStatus.toLowerCase();

    const matchesSearch =
      searchQuery === "" ||
      app.firstName?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Get status badge class
  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      "under review": "bg-blue-100 text-blue-800",
      shortlisted: "bg-purple-100 text-purple-800",
      "interview scheduled": "bg-indigo-100 text-indigo-800",
      selected: "bg-green-100 text-green-800",
      "offer received": "bg-emerald-100 text-emerald-800",
      rejected: "bg-red-100 text-red-800",
    };
    return badges[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get count by status
  const getStatusCount = (status) => {
    return applications.filter(
      (app) => app.employApplicantStatus?.toLowerCase() === status.toLowerCase()
    ).length;
  };

  // Format salary
  const formatSalary = (from, to, type) => {
    if (!from || !to) return "Not specified";
    return `₹${from.toLocaleString()} - ₹${to.toLocaleString()} / ${type}`;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading applications...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              onClick={() => navigate("/employer/jobs")}
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Custom CSS to hide scrollbars while maintaining scroll functionality */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <span className="text-xl">←</span>
              <span>Back to Jobs</span>
            </button>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold mb-3">
                  {job?.jobTitle}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm lg:text-base">
                  <span className="flex items-center gap-2">
                    <span>🏢</span> {job?.companyName}
                  </span>
                  <span className="flex items-center gap-2">
                    <span>📍</span> {job?.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <span>💼</span> {job?.jobType}
                  </span>
                  <span className="flex items-center gap-2">
                    <span>📊</span> {applications.length} Application
                    {applications.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center min-w-[100px]">
                  <div className="text-3xl font-bold">
                    {applications.length}
                  </div>
                  <div className="text-sm opacity-90">Total</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center min-w-[100px]">
                  <div className="text-3xl font-bold">
                    {getStatusCount("Shortlisted")}
                  </div>
                  <div className="text-sm opacity-90">Shortlisted</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center min-w-[100px]">
                  <div className="text-3xl font-bold">
                    {getStatusCount("Selected")}
                  </div>
                  <div className="text-sm opacity-90">Selected</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("job-details")}
                className={`py-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "job-details"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                📄 Job Details
              </button>
              <button
                onClick={() => setActiveTab("applicants")}
                className={`py-4 px-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === "applicants"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                👥 Applicants ({applications.length})
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Job Details Tab */}
          {activeTab === "job-details" && job && (
            <div className="space-y-6">
              {/* Job Overview Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Job Overview
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Job ID</div>
                    <div className="font-medium text-gray-900">{job.jobId}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Category</div>
                    <div className="font-medium text-gray-900">
                      {job.category}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Position Level
                    </div>
                    <div className="font-medium text-gray-900 capitalize">
                      {job.position}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Vacancies</div>
                    <div className="font-medium text-gray-900">
                      {job.vacancy} positions
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Experience Required
                    </div>
                    <div className="font-medium text-gray-900">
                      {job.experienceLevel} years
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Education Level
                    </div>
                    <div className="font-medium text-gray-900 capitalize">
                      {job.educationLevel}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Salary Range
                    </div>
                    <div className="font-medium text-gray-900">
                      {formatSalary(
                        job.salaryFrom,
                        job.salaryTo,
                        job.salaryType
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Remote Work
                    </div>
                    <div className="font-medium text-gray-900">
                      {job.isRemote ? "Yes" : "No"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Status</div>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium capitalize">
                      {job.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Job Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {job.jobDescription}
                </p>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Key Responsibilities
                  </h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="text-indigo-600 mt-1">•</span>
                        <span className="text-gray-700 flex-1">
                          {responsibility}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Qualifications */}
              {job.qualifications && job.qualifications.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Qualifications
                  </h2>
                  <ul className="space-y-3">
                    {job.qualifications.map((qualification, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="text-indigo-600 mt-1">✓</span>
                        <span className="text-gray-700 flex-1">
                          {qualification}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Required Skills
                  </h2>
                  <ul className="space-y-3">
                    {job.skills.map((skill, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="text-indigo-600 mt-1">⚡</span>
                        <span className="text-gray-700 flex-1">{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Benefits & Perks
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.benefits}
                  </p>
                </div>
              )}

              {/* Location Information */}
              {job.locationTypes && job.locationTypes.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Work Locations
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.locationTypes.map((location, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium"
                      >
                        📍 {location}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Company Information */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Company Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">
                      Company Name
                    </div>
                    <div className="font-medium text-gray-900">
                      {job.companyName}
                    </div>
                  </div>
                  {job.companyAddress && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Address</div>
                      <div className="text-gray-700 whitespace-pre-line">
                        {job.companyAddress}
                      </div>
                    </div>
                  )}
                  {job.companyWebsite && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Website</div>
                      <a
                        href={job.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        {job.companyWebsite}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {job.contactEmail && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Email</div>
                      <a
                        href={`mailto:${job.contactEmail}`}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        {job.contactEmail}
                      </a>
                    </div>
                  )}
                  {job.contactPhone && (
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Phone</div>
                      <a
                        href={`tel:${job.contactPhone}`}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        {job.contactPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Application Instructions */}
              {job.applicationInstructions && (
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Application Instructions
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.applicationInstructions}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Applicants Tab */}
          {activeTab === "applicants" && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                {/* Search Box */}
                <div className="mb-6">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      🔍
                    </span>
                    <input
                      type="text"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="Search by candidate name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterStatus === "all"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                      {applications.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setFilterStatus("pending")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterStatus === "pending"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Pending
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                      {getStatusCount("Pending")}
                    </span>
                  </button>
                  <button
                    onClick={() => setFilterStatus("under review")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterStatus === "under review"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Under Review
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                      {getStatusCount("Under Review")}
                    </span>
                  </button>
                  <button
                    onClick={() => setFilterStatus("shortlisted")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterStatus === "shortlisted"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Shortlisted
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                      {getStatusCount("Shortlisted")}
                    </span>
                  </button>
                  <button
                    onClick={() => setFilterStatus("interview scheduled")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterStatus === "interview scheduled"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Interview
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                      {getStatusCount("Interview Scheduled")}
                    </span>
                  </button>
                  <button
                    onClick={() => setFilterStatus("selected")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterStatus === "selected"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Selected
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
                      {getStatusCount("Selected")}
                    </span>
                  </button>
                </div>
              </div>

              {/* Applications List */}
              {filteredApplications.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Applications Found
                  </h3>
                  <p className="text-gray-600">
                    There are no applications matching your filters.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredApplications.map((application) => (
                    <div
                      key={application._id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100"
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
                        {/* Left Section */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                            {application.firstName?.charAt(0).toUpperCase() ||
                              "A"}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {application.firstName}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                                  application.employApplicantStatus
                                )}`}
                              >
                                {application.employApplicantStatus || "Pending"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">
                              Applied on {formatDate(application.appliedDate)}
                            </p>

                            {application.coverLetter && (
                              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                <p className="text-xs font-medium text-gray-700 mb-1">
                                  Cover Letter:
                                </p>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {application.coverLetter}
                                </p>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => openCandidateModal(application)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
                              >
                                <span>👁️</span>
                                <span>View Details</span>
                              </button>
                              {application.resume?.url && (
                                <button
                                  onClick={() =>
                                    downloadResume(application.resume.url)
                                  }
                                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2"
                                >
                                  <span>📄</span>
                                  <span>Resume</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Candidate Details Modal - WITH HIDDEN SCROLLBAR */}
        {showCandidateModal && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
              onClick={closeCandidateModal}
            ></div>

            {/* Modal - Compact Width with Hidden Scrollbar */}
            <div className="fixed inset-y-0 right-0 w-full md:w-[550px] lg:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto hide-scrollbar transform transition-transform mt-18 mb-2">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-4 z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Candidate Details</h2>
                  <button
                    onClick={closeCandidateModal}
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    <span className="text-lg">✕</span>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-5">
                {loadingCandidate ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-gray-600">
                      Loading candidate details...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Candidate Profile - Compact */}
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-3">
                        {selectedCandidate?.firstName
                          ?.charAt(0)
                          .toUpperCase() || "A"}
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {selectedCandidate?.firstName}
                      </h2>
                      <span
                        className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${getStatusBadge(
                          selectedCandidate?.employApplicantStatus
                        )}`}
                      >
                        {selectedCandidate?.employApplicantStatus || "Pending"}
                      </span>
                    </div>

                    {/* Application Info */}
                    <div className="mb-5">
                      <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <span>📋</span> Application Information
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Applied Date:</span>
                          <span className="font-medium text-gray-900">
                            {formatDate(selectedCandidate?.appliedDate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Application ID:</span>
                          <span className="font-medium text-gray-900 text-xs">
                            {selectedCandidate?._id?.substring(0, 12)}...
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    {candidateDetails && (
                      <div className="mb-5">
                        <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <span>📞</span> Contact Information
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2.5">
                          {candidateDetails.email && (
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg">📧</span>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-gray-500 mb-0.5">
                                  Email
                                </div>
                                <a
                                  href={`mailto:${candidateDetails.email}`}
                                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm truncate block"
                                >
                                  {candidateDetails.email}
                                </a>
                              </div>
                            </div>
                          )}
                          {candidateDetails.phone && (
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg">📱</span>
                              <div className="flex-1">
                                <div className="text-xs text-gray-500 mb-0.5">
                                  Phone
                                </div>
                                <a
                                  href={`tel:${candidateDetails.phone}`}
                                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                                >
                                  {candidateDetails.phone}
                                </a>
                              </div>
                            </div>
                          )}
                          {candidateDetails.location && (
                            <div className="flex items-center gap-2.5">
                              <span className="text-lg">📍</span>
                              <div className="flex-1">
                                <div className="text-xs text-gray-500 mb-0.5">
                                  Location
                                </div>
                                <span className="text-gray-900 font-medium text-sm">
                                  {candidateDetails.location}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Cover Letter */}
                    {selectedCandidate?.coverLetter && (
                      <div className="mb-5">
                        <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <span>✉️</span> Cover Letter
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {selectedCandidate.coverLetter}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Resume */}
                    {selectedCandidate?.resume?.url && (
                      <div className="mb-5 mt-4">
                        <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <span>📄</span> Resume / CV
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-11 h-11 bg-indigo-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                              📄
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm truncate">
                                {selectedCandidate.resume.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                PDF Document
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              downloadResume(selectedCandidate.resume.url)
                            }
                            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium flex items-center gap-1.5 flex-shrink-0"
                          >
                            <span>⬇</span>
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {candidateDetails?.skills &&
                      candidateDetails.skills.length > 0 && (
                        <div className="mb-5">
                          <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <span>⚡</span> Skills
                          </h3>
                          <div className="flex flex-wrap gap-1.5">
                            {candidateDetails.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Experience */}
                    {candidateDetails?.experience && (
                      <div className="mb-5">
                        <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <span>💼</span> Experience
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {candidateDetails.experience}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {candidateDetails?.education && (
                      <div className="mb-5">
                        <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <span>🎓</span> Education
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {candidateDetails.education}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Status Actions - 2 Column Grid */}
                    <div className="mb-5 mt-6">
                      <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span>🎯</span> Update Application Status
                      </h3>
                      <div className="grid grid-cols-2 gap-2.5">
                        <button
                          onClick={() => handleStatusChange("Under Review")}
                          disabled={
                            selectedCandidate?.employApplicantStatus ===
                            "Under Review"
                          }
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedCandidate?.employApplicantStatus ===
                            "Under Review"
                              ? "bg-blue-50 border-blue-500 text-blue-700"
                              : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <div className="text-xl mb-1">🔍</div>
                          <div className="text-xs font-medium">
                            Under Review
                          </div>
                        </button>

                        <button
                          onClick={() => handleStatusChange("Shortlisted")}
                          disabled={
                            selectedCandidate?.employApplicantStatus ===
                            "Shortlisted"
                          }
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedCandidate?.employApplicantStatus ===
                            "Shortlisted"
                              ? "bg-purple-50 border-purple-500 text-purple-700"
                              : "border-gray-200 hover:border-purple-500 hover:bg-purple-50"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <div className="text-xl mb-1">⭐</div>
                          <div className="text-xs font-medium">Shortlist</div>
                        </button>

                        <button
                          onClick={() =>
                            handleStatusChange("Interview Scheduled")
                          }
                          className="p-3 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                        >
                          <div className="text-xl mb-1">📅</div>
                          <div className="text-xs font-medium">
                            Schedule Interview
                          </div>
                        </button>

                        <button
                          onClick={() => handleStatusChange("Selected")}
                          disabled={
                            selectedCandidate?.employApplicantStatus ===
                            "Selected"
                          }
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedCandidate?.employApplicantStatus ===
                            "Selected"
                              ? "bg-green-50 border-green-500 text-green-700"
                              : "border-gray-200 hover:border-green-500 hover:bg-green-50"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <div className="text-xl mb-1">✅</div>
                          <div className="text-xs font-medium">Select</div>
                        </button>

                        <button
                          onClick={() => handleStatusChange("Offer Received")}
                          disabled={
                            selectedCandidate?.employApplicantStatus ===
                            "Offer Received"
                          }
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedCandidate?.employApplicantStatus ===
                            "Offer Received"
                              ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                              : "border-gray-200 hover:border-emerald-500 hover:bg-emerald-50"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <div className="text-xl mb-1">💼</div>
                          <div className="text-xs font-medium">Send Offer</div>
                        </button>

                        <button
                          onClick={() => handleStatusChange("Rejected")}
                          disabled={
                            selectedCandidate?.employApplicantStatus ===
                            "Rejected"
                          }
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedCandidate?.employApplicantStatus ===
                            "Rejected"
                              ? "bg-red-50 border-red-500 text-red-700"
                              : "border-gray-200 hover:border-red-500 hover:bg-red-50"
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <div className="text-xl mb-1">❌</div>
                          <div className="text-xs font-medium">Reject</div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* Interview Schedule Modal */}
        {showInterviewModal && (
          <>
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowInterviewModal(false)}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">
                      Schedule Interview
                    </h3>
                    <button
                      onClick={() => setShowInterviewModal(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-gray-700">
                    Scheduling interview for:{" "}
                    <strong className="text-gray-900">
                      {selectedCandidate?.firstName}
                    </strong>
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Date *
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interview Time *
                    </label>
                    <input
                      type="time"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      value={interviewTime}
                      onChange={(e) => setInterviewTime(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                      rows="4"
                      placeholder="Add any additional notes or instructions for the candidate..."
                      value={interviewNotes}
                      onChange={(e) => setInterviewNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <button
                    onClick={() => setShowInterviewModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitInterview}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Schedule Interview
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default JobApplications;
