import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import MainLayout from "../../layout/MainLayout";
import { disableJobStatus, getAllJobPosted } from "../../../../api/service/employerService";

const AllJobList = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getAllJobPosted(userId);
      setJobs(response.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to Post Job page
  const handlePostJob = () => {
    navigate("/employer/post-new-job");
  };

  // Show preview modal
  const handlePreviewJob = (job) => {
    setSelectedJob(job);
    setShowPreviewModal(true);
  };

  // Navigate to Edit Job page
  const handleEditJob = (jobId) => {
    navigate(`/employer/edit-job/${jobId}`);
  };

  // Show delete confirmation modal
  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  // Toggle job status (active/inactive)
  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;

    try {
      // Toggle the isActive status instead of actually deleting
      const response = await disableJobStatus(jobToDelete._id)
      
      
      

      if (response.status===200) {
        // Update job status in state
        setJobs(
          jobs.map((job) =>
            job._id === jobToDelete._id
              ? { ...job, isActive: !job.isActive }
              : job
          )
        );
        toast.success(
          `Job ${
            jobToDelete.isActive ? "deactivated" : "activated"
          } successfully!`
        );
        setShowDeleteModal(false);
        setJobToDelete(null);
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to update job status");
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("An error occurred while updating the job");
    }
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setJobToDelete(null);
  };

  // Close preview modal
  const handleClosePreview = () => {
    setShowPreviewModal(false);
    setSelectedJob(null);
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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading jobs...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Job Posted</h2>
          <p className="text-gray-600">Manage all your posted jobs</p>
        </div>
        <button
          onClick={handlePostJob}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Post New Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Total Jobs</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{jobs.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Active Jobs</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {jobs.filter((j) => j.isActive && j.status === "open").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Inactive Jobs</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {jobs.filter((j) => !j.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Total Applications</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {jobs.reduce(
              (sum, job) => sum + (job.applications?.length || 0),
              0
            )}
          </p>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sl No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Job ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No jobs posted yet
                  </td>
                </tr>
              ) : (
                jobs.map((job, index) => (
                  <tr
                    key={job._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-800">
                        {job.jobId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {job.jobTitle}
                        </p>
                        <p className="text-sm text-gray-500">
                          {job.companyName}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">
                        {job.applications?.length || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          job.isActive && job.status === "open"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {job.isActive && job.status === "open"
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* Preview Button */}
                        <button
                          onClick={() => handlePreviewJob(job)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Preview Job"
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

                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditJob(job._id)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Edit Job"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>

                        {/* Delete/Toggle Status Button */}
                        <button
                          onClick={() => handleDeleteClick(job)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title={
                            job.isActive ? "Deactivate Job" : "Activate Job"
                          }
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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
      </div>

      {/* Preview Modal */}
      {showPreviewModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Job Details</h3>
              <button
                onClick={handleClosePreview}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-2">
                      {selectedJob.jobTitle}
                    </h4>
                    <p className="text-lg text-gray-600 mb-4">
                      {selectedJob.companyName}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                        {selectedJob.jobType}
                      </span>
                      <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">
                        {selectedJob.position}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-600 text-sm rounded-full">
                        {selectedJob.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Job ID</p>
                    <p className="font-mono text-lg font-semibold text-gray-800">
                      {selectedJob.jobId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="text-gray-800 font-medium">
                    {selectedJob.location}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Experience Level</p>
                  <p className="text-gray-800 font-medium">
                    {selectedJob.experienceLevel} years
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Education</p>
                  <p className="text-gray-800 font-medium capitalize">
                    {selectedJob.educationLevel}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Salary Range</p>
                  <p className="text-gray-800 font-medium">
                    ₹{selectedJob.salaryFrom.toLocaleString()} - ₹
                    {selectedJob.salaryTo.toLocaleString()} (
                    {selectedJob.salaryType})
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Applications</p>
                  <p className="text-gray-800 font-medium">
                    {selectedJob.applications?.length || 0}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Posted On</p>
                  <p className="text-gray-800 font-medium">
                    {formatDate(selectedJob.createdAt)}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h5 className="font-semibold text-gray-800 mb-3">
                  Contact Information
                </h5>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Email:</span>{" "}
                    {selectedJob.contactEmail}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedJob.contactPhone}
                  </p>
                </div>
              </div>

              {/* Skills */}
              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-3">
                    Required Skills
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-indigo-100 text-indigo-600 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {selectedJob.benefits && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-3">Benefits</h5>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-line">
                      {selectedJob.benefits}
                    </p>
                  </div>
                </div>
              )}

              {/* Application Instructions */}
              {selectedJob.applicationInstructions && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-3">
                    Application Instructions
                  </h5>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-line">
                      {selectedJob.applicationInstructions}
                    </p>
                  </div>
                </div>
              )}

              {/* Company Address */}
              {selectedJob.companyAddress && (
                <div>
                  <h5 className="font-semibold text-gray-800 mb-3">
                    Company Address
                  </h5>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-line">
                      {selectedJob.companyAddress}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={handleClosePreview}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleClosePreview();
                  handleEditJob(selectedJob._id);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Edit Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete/Toggle Status Confirmation Modal */}
      {showDeleteModal && jobToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`${
                  jobToDelete.isActive ? "bg-red-100" : "bg-green-100"
                } p-3 rounded-full`}
              >
                <svg
                  className={`w-6 h-6 ${
                    jobToDelete.isActive ? "text-red-600" : "text-green-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {jobToDelete.isActive ? "Deactivate" : "Activate"} Job
                </h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to{" "}
                  {jobToDelete.isActive ? "deactivate" : "activate"} this job?
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-semibold text-gray-800">
                {jobToDelete.jobTitle}
              </p>
              <p className="text-sm text-gray-600">
                {jobToDelete.companyName} • {jobToDelete.jobId}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  jobToDelete.isActive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {jobToDelete.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default AllJobList;
