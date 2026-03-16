import { axiosInstance } from "../axiosInstance/axiosInstance";
import axios from "axios";

export const registerEmployer = async (
  companyName,
  contactPerson,
  contactEmail,
  fullMobile,
  password
) => {
  try {
    const response = await axiosInstance.post(`/signup`, {
      companyName,
      contactPerson,
      contactEmail,
      fullMobile,
      password,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const loginEmployer = async (userEmail, password) => {
  try {
    const response = await axiosInstance.post(`/login`, {
      userEmail,
      password,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const postNewJob = async (userId, jobData) => {
  try {
    const response = await axiosInstance.post(`/postjob/${userId}`, {
      jobData,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const getAllJobPosted = async (userId, jobData) => {
  try {
    const response = await axiosInstance.get(`/fetchjob/${userId}`, {
      jobData,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const getJobDetails = async (jobId) => {
  try {
    const response = await axiosInstance.get(`/viewjobs/${jobId}`);
    return response;
  } catch (err) {
    return err;
  }
};

export const updateJob = async (jobId, updatedData) => {
  try {
    const response = await axiosInstance.put(`/editjob/${jobId}`, {
      updatedData,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const disableJobStatus = async (jobId, userId) => {
  try {
    const response = await axiosInstance.put(
      `/editjob-status/${jobId}/${userId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getCandidateDetails = async (candidateId) => {
  try {
    const response = await axiosInstance.get(
      `/get-candidate-details/${candidateId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const updateJobApplicationStatus = async (
  jobId,
  applicationId,
  newStatus,
  additionalData
) => {
  try {
    const response = await axiosInstance.put(
      `/update-candidate-job-application-status/${jobId}`,
      { applicationId, newStatus, additionalData }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getJobCountExceeded = async (employerId) => {
  try {
    const response = await axiosInstance.get(
      `/get-job-post-count-exceeded-or-not/${employerId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getActiveJobPosted = async (employerId) => {
  try {
    const response = await axiosInstance.get(
      `/get-active-job-data/${employerId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};
export const getInActiveJobPosted = async (employerId) => {
  try {
    const response = await axiosInstance.get(
      `/get-inactive-job-data/${employerId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getCandidateData = async () => {
  try {
    const response = await axiosInstance.get(`/get-candidate-database-data`);
    return response;
  } catch (err) {
    return err;
  }
};

export const getShortListedCandidateData = async (employerId) => {
  try {
    const response = await axiosInstance.get(
      `/get-shortlisted-candidate-data/${employerId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};


export const createAchatRoom = async (employerId, candidateId) => {
  try {
    const response = await axiosInstance.post(
      `/create-chat-room/${employerId}/${candidateId}`,

    );
    return response;
  } catch (err) {
    return err;
  }
};





export const sendVerificationOtp = async (
  companyEmail,
  contactPerson,
  companyName,

) => {
  try {
    const response = await axiosInstance.post(`/send-verification-otp`, {
      companyEmail,
      contactPerson,
      companyName,

    });
    return response;
  } catch (err) {
    return err;
  }
};


export const verifyOtpEmployer = async (userEmail, otp) => {
  try {
    const response = await axiosInstance.post(`/verifyemailotp`, {
      userEmail,
      otp,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const getEmployerData = async (employerId) => {
  try {
    const response = await axiosInstance.get(`/get-employer-topbar-data/${employerId}`);
    return response;
  } catch (err) {
    return err;
  }
};

export const getDashboardData = async (employerId) => {
  try {
    const response = await axiosInstance.get(`/get-dashboard-data/${employerId}`);
    return response;
  } catch (err) {
    return err;
  }
};

export const getInterviewDetails = async (employerId) => {
  try {
    const response = await axiosInstance.get(`/get-interview-details/${employerId}`);
    return response;
  } catch (err) {
    return err;
  }
};

export const getAppliedCandidates = async (jobId) => {
  try {
    const response = await axiosInstance.get(`/fetchappliedcand/${jobId}`);
    return response;
  } catch (err) {
    return err;
  }
};

export const getSuggestedCandidates = async (employerId) => {
  try {
    const response = await axiosInstance.get(`/get-suggested-candidates/${employerId}`);
    return response;
  } catch (err) {
    return err;
  }
};

export const generalAIChat = async (message, chatHistory) => {
  return await axiosInstance.post(`/ai-chat`, { message, chatHistory });
};

export const getAllEmployerPlans = async () => {
  try {
    const plansAPIUrl = import.meta.env.VITE_BASE_ROUTE_JOBSTORM.replace("/employer", "/admin/getallplans");
    const response = await axios.get(plansAPIUrl);
    return response;
  } catch (err) {
    return err;
  }
};
export const getEmployerDetailsFull = async (employerId) => {
  try {
    const response = await axiosInstance.get(`/fetchemployer/${employerId}`);
    return response;
  } catch (err) {
    return err;
  }
};
export const updateEmployerProfile = async (employerId, updatedData) => {
  try {
    const response = await axiosInstance.put(
      `/updateemployer/${employerId}`,
      updatedData
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const uploadEmployerProfilePic = async (employerId, formData) => {
  try {
    const response = await axiosInstance.put(
      `/uploadprofilepic/${employerId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const uploadEmployerCoverPic = async (employerId, formData) => {
  try {
    const response = await axiosInstance.put(
      `/uploadcoverpic/${employerId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const applyCandidateToJob = async (jobId, candidateId) => {
  try {
    const response = await axiosInstance.post(`/apply-job/${jobId}/${candidateId}`);
    return response;
  } catch (err) {
    return err;
  }
};

export const employerForgotPassword = async (userEmail) => {
  try {
    const response = await axiosInstance.post(`/employerforgotpassword`, {
      userEmail,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const employerVerifyOTP = async (userEmail, otp) => {
  try {
    const response = await axiosInstance.post(`/employerverify-otp`, {
      userEmail,
      otp,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const employerResendOTP = async (userEmail) => {
  try {
    const response = await axiosInstance.post(`/employerresend-otp`, {
      userEmail,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const employerChangePassword = async (userEmail, newPassword) => {
  try {
    const response = await axiosInstance.post(`/employerchange-password`, {
      userEmail,
      newPassword,
    });
    return response;
  } catch (err) {
    return err;
  }
};