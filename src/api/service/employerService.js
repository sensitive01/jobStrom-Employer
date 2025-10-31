import { axiosInstance } from "../axiosInstance/axiosInstance";

export const registerEmployer = async (
  companyName,
  contactPerson,
  contactEmail,
  password
) => {
  try {
    const response = await axiosInstance.post(`/signup`, {
      companyName,
      contactPerson,
      contactEmail,
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


export const sendMessage = async (messageData) => {
  try {
    const response = await axiosInstance.post(
      `/get-shortlisted-candidate-data/${employerId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};
