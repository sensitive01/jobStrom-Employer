import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EmployerLogin from "./componets/login/EmployerLogin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployerSignUpPage from "./componets/register/EmployerSignUpPage";
import DashboardPage from "./componets/dashboard/componets/dashboard/DashboardPage";
import JobPostedPage from "./componets/dashboard/componets/jobs/AllJobList";
import PostJobForm from "./componets/dashboard/componets/jobs/PostJobForm";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<EmployerSignUpPage />} />
        <Route path="/login" element={<EmployerLogin />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/all-job-list" element={<JobPostedPage />} />
        <Route path="/post-new-job" element={<PostJobForm />} />
        <Route path="/edit-job/:id" element={<PostJobForm />} />



      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
