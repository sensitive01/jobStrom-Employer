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

export const postNewJob = async (userId,jobData) => {
  try {
    const response = await axiosInstance.post(`/postjob/${userId}`, {
      jobData,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const getAllJobPosted = async (userId,jobData) => {
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

export const updateJob = async (jobId,updatedData) => {
  try {
    const response = await axiosInstance.put(`/editjob/${jobId}`,{updatedData});
    return response;
  } catch (err) {
    return err;
  }
};

export const disableJobStatus = async (jobId) => {
  try {
    const response = await axiosInstance.put(`/editjob-status/${jobId}`,);
    return response;
  } catch (err) {
    return err;
  }
};