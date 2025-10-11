import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import MainLayout from "../../layout/MainLayout";
import {
  getJobDetails,
  postNewJob,
  updateJob,
} from "../../../../api/service/employerService";

const PostJobPage = () => {
  const { id } = useParams();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basic");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [responsibilities, setResponsibilities] = useState([]);
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [qualifications, setQualifications] = useState([]);
  const [qualificationInput, setQualificationInput] = useState("");
  const [locationTypes, setLocationTypes] = useState([]);
  const [locationTypeInput, setLocationTypeInput] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    category: "",
    jobType: "",
    experienceLevel: "",
    educationLevel: "",
    position: "",
    vacancy: "",
    salaryFrom: "",
    salaryTo: "",
    salaryType: "",
    applicationDeadline: "",
    contactEmail: "",
    contactPhone: "",
    companyWebsite: "",
    benefits: "",
    applicationInstructions: "",
    location: "",
    companyAddress: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await getJobDetails(id);
          if (response.status === 200) {
            const jobData = response.data;
            setFormData({
              companyName: jobData.companyName || "",
              jobTitle: jobData.jobTitle || "",
              jobDescription: jobData.jobDescription || "",
              category: jobData.category || "",
              jobType: jobData.jobType || "",
              experienceLevel: jobData.experienceLevel || "",
              educationLevel: jobData.educationLevel || "",
              position: jobData.position || "",
              vacancy: jobData.vacancy || "",
              salaryFrom: jobData.salaryFrom || "",
              salaryTo: jobData.salaryTo || "",
              salaryType: jobData.salaryType || "",
              applicationDeadline: jobData.applicationDeadline || "",
              contactEmail: jobData.contactEmail || "",
              contactPhone: jobData.contactPhone || "",
              companyWebsite: jobData.companyWebsite || "",
              benefits: jobData.benefits || "",
              applicationInstructions: jobData.applicationInstructions || "",
              location: jobData.location || "",
              companyAddress: jobData.companyAddress || "",
            });

            // Set array fields
            setSkills(Array.isArray(jobData.skills) ? jobData.skills : []);
            setResponsibilities(
              Array.isArray(jobData.responsibilities)
                ? jobData.responsibilities
                : []
            );
            setQualifications(
              Array.isArray(jobData.qualifications)
                ? jobData.qualifications
                : []
            );
            setLocationTypes(
              Array.isArray(jobData.locationTypes) ? jobData.locationTypes : []
            );
            setIsRemote(jobData.isRemote || false);
            setIsEditMode(true);
          }
        } catch (error) {
          console.error("Error fetching job details:", error);
          toast.error("Failed to load job details");
        }
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Skills handlers
  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  // Responsibilities handlers
  const handleAddResponsibility = () => {
    if (
      responsibilityInput.trim() &&
      !responsibilities.includes(responsibilityInput.trim())
    ) {
      setResponsibilities([...responsibilities, responsibilityInput.trim()]);
      setResponsibilityInput("");
    }
  };

  const handleRemoveResponsibility = (item) => {
    setResponsibilities(responsibilities.filter((resp) => resp !== item));
  };

  // Qualifications handlers
  const handleAddQualification = () => {
    if (
      qualificationInput.trim() &&
      !qualifications.includes(qualificationInput.trim())
    ) {
      setQualifications([...qualifications, qualificationInput.trim()]);
      setQualificationInput("");
    }
  };

  const handleRemoveQualification = (item) => {
    setQualifications(qualifications.filter((qual) => qual !== item));
  };

  // Location Types handlers
  const handleAddLocationType = () => {
    if (
      locationTypeInput.trim() &&
      !locationTypes.includes(locationTypeInput.trim())
    ) {
      setLocationTypes([...locationTypes, locationTypeInput.trim()]);
      setLocationTypeInput("");
    }
  };

  const handleRemoveLocationType = (typeToRemove) => {
    setLocationTypes(locationTypes.filter((type) => type !== typeToRemove));
  };

  const handleKeyPress = (e, addFunction) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFunction();
    }
  };

  const validateBasicInfo = () => {
    if (!formData.jobTitle) {
      toast.error("Job Title is required");
      return false;
    }
    if (!formData.jobDescription) {
      toast.error("Job Description is required");
      return false;
    }
    if (!formData.category) {
      toast.error("Category is required");
      return false;
    }
    if (!formData.salaryFrom) {
      toast.error("Salary From is required");
      return false;
    }
    if (!formData.salaryTo) {
      toast.error("Salary To is required");
      return false;
    }
    return true;
  };

  const handleSaveAndNext = () => {
    if (validateBasicInfo()) {
      setActiveTab("location");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateBasicInfo()) {
      return;
    }

    if (!formData.location) {
      toast.error("Location is required");
      return;
    }

    setLoading(true);

    try {
      const jobData = {
        ...formData,
        skills: skills,
        responsibilities: responsibilities,
        qualifications: qualifications,
        locationTypes: locationTypes,
        isRemote: isRemote,
      };

      let response;
      if (isEditMode && id) {
        // Update existing job
        response = await updateJob(id, jobData);
        if (response.status === 200) {
          toast.success("Job updated successfully");
          setTimeout(() => {
            navigate("/employer/all-job-list");
          }, 1500);
        }
      } else {
        // Create new job
        response = await postNewJob(userId, jobData);
        if (response.status === 201) {
          toast.success(response.data.message);
          setTimeout(() => {
            navigate("/employer/all-job-list");
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Error posting/updating job:", error);
      toast.error(
        isEditMode
          ? "An error occurred while updating the job"
          : "An error occurred while posting the job"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/employer/all-job-list");
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Edit Job" : "Post Job"}
          </h2>
          <button
            onClick={handleCancel}
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

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab("basic")}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === "basic"
                ? "text-yellow-500 border-b-2 border-yellow-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Basic Information
          </button>
          <button
            onClick={() => setActiveTab("location")}
            className={`px-6 py-4 font-medium transition-colors ${
              activeTab === "location"
                ? "text-yellow-500 border-b-2 border-yellow-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Location
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Basic Information Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                {/* Company Name and Job Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="e.g., Product Designer / UI Designer"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Describe the role, expectations, and what makes this position unique..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                {/* Category and Job Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="IT">IT & Software</option>
                      <option value="marketing">Marketing</option>
                      <option value="sales">Sales</option>
                      <option value="design">Design</option>
                      <option value="engineering">Engineering</option>
                      <option value="finance">Finance</option>
                      <option value="hr">Human Resources</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    >
                      <option value="">Select Job Type</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                      <option value="temporary">Temporary</option>
                      <option value="freelance">Freelance</option>
                    </select>
                  </div>
                </div>

                {/* Experience Level, Position, and Vacancy */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    >
                      <option value="">Select Experience</option>
                      <option value="0-1">0-1 Year</option>
                      <option value="1-3">1-3 Years</option>
                      <option value="3-5">3-5 Years</option>
                      <option value="5-10">5-10 Years</option>
                      <option value="10+">10+ Years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    >
                      <option value="">Select Position</option>
                      <option value="junior">Junior</option>
                      <option value="mid">Mid-Level</option>
                      <option value="senior">Senior</option>
                      <option value="lead">Lead</option>
                      <option value="manager">Manager</option>
                      <option value="director">Director</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Vacancies{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="vacancy"
                      value={formData.vacancy}
                      onChange={handleChange}
                      min="1"
                      placeholder="e.g., 8"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>
                </div>

                {/* Education Level and Application Deadline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    >
                      <option value="">Select Education Level</option>
                      <option value="high-school">High School</option>
                      <option value="associate">Associate Degree</option>
                      <option value="bachelor">Bachelor's Degree</option>
                      <option value="master">Master's Degree</option>
                      <option value="phd">PhD</option>
                      <option value="any">Any Degree</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                {/* Salary Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary From <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="salaryFrom"
                      value={formData.salaryFrom}
                      onChange={handleChange}
                      placeholder="e.g., 2150"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary To <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="salaryTo"
                      value={formData.salaryTo}
                      onChange={handleChange}
                      placeholder="e.g., 3500"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="salaryType"
                      value={formData.salaryType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="hourly">Per Hour</option>
                      <option value="monthly">Per Month</option>
                      <option value="yearly">Per Year</option>
                    </select>
                  </div>
                </div>

                {/* Responsibilities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Responsibilities
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={responsibilityInput}
                      onChange={(e) => setResponsibilityInput(e.target.value)}
                      onKeyPress={(e) =>
                        handleKeyPress(e, handleAddResponsibility)
                      }
                      placeholder="Add responsibility and press Enter"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddResponsibility}
                      className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {responsibilities.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {responsibilities.map((resp, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="text-purple-600 mt-1">•</span>
                          <span className="flex-1 text-gray-700">{resp}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveResponsibility(resp)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Qualifications */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualifications
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={qualificationInput}
                      onChange={(e) => setQualificationInput(e.target.value)}
                      onKeyPress={(e) =>
                        handleKeyPress(e, handleAddQualification)
                      }
                      placeholder="Add qualification and press Enter"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddQualification}
                      className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {qualifications.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {qualifications.map((qual, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="text-purple-600 mt-1">•</span>
                          <span className="flex-1 text-gray-700">{qual}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveQualification(qual)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Skills & Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills & Experience
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleAddSkill)}
                      placeholder="Add skill and press Enter (e.g., PHP, JS, React)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-purple-600 text-white px-3 py-1 rounded text-sm flex items-center gap-2"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-purple-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder="hr@company.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder="+589 560 56555"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>
                </div>

                {/* Company Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Website
                  </label>
                  <input
                    type="url"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="www.company.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                {/* Benefits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Benefits & Perks
                  </label>
                  <textarea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe benefits such as health insurance, flexible hours, remote work options, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                {/* Application Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Instructions
                  </label>
                  <textarea
                    name="applicationInstructions"
                    value={formData.applicationInstructions}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Special instructions for applicants (e.g., required documents, application process)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>
            )}

            {/* Location Tab */}
            {activeTab === "location" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State/Province"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Address
                  </label>
                  <textarea
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Full company address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Types
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={locationTypeInput}
                      onChange={(e) => setLocationTypeInput(e.target.value)}
                      onKeyPress={(e) =>
                        handleKeyPress(e, handleAddLocationType)
                      }
                      placeholder="Add location type and press Enter (e.g., Office, Hybrid)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddLocationType}
                      className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {locationTypes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {locationTypes.map((type, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {type}
                          <button
                            type="button"
                            onClick={() => handleRemoveLocationType(type)}
                            className="hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isRemote"
                    checked={isRemote}
                    onChange={(e) => setIsRemote(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-600"
                  />
                  <label htmlFor="isRemote" className="text-sm text-gray-700">
                    This is a Remote Job
                  </label>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          {activeTab === "basic" ? (
            <button
              type="button"
              onClick={handleSaveAndNext}
              className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Save & Next
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Posting..."
                : isEditMode
                ? "Update"
                : "Post"}
            </button>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default PostJobPage;
