import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EmployerLogin from "./componets/login/EmployerLogin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployerSignUpPage from "./componets/register/EmployerSignUpPage";
import DashboardPage from "./componets/dashboard/componets/dashboard/DashboardPage";
import JobPostedPage from "./componets/dashboard/componets/jobs/AllJobList";
import PostJobForm from "./componets/dashboard/componets/jobs/PostJobForm";
import PreviewJobs from "./componets/dashboard/componets/jobs/PreviewJobs";
import ActiveJobs from "./componets/dashboard/componets/jobs/activejobs/ActiveJobs";
import ClosedJobs from "./componets/dashboard/componets/jobs/closedjobs/ClosedJobs";
import AllCandidate from "./componets/dashboard/componets/candidates/AllCandidate";
import ViewCandidateDetails from "./componets/dashboard/componets/candidates/ViewCandidateDetails";
import ChatPage from "./componets/dashboard/componets/chat/ChatPage";
import ShortListedCandidate from "./componets/dashboard/componets/candidates/ShortListedCandidate";
import HiredCandidates from "./componets/dashboard/componets/candidates/HiredCandidates";
import InterViewSheduledCandidate from "./componets/dashboard/componets/candidates/InterViewSheduledCandidate";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<EmployerSignUpPage />} />
        <Route path="/" element={<EmployerLogin />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/all-job-list" element={<JobPostedPage />} />
        <Route path="/post-new-job" element={<PostJobForm />} />
        <Route path="/edit-job/:id" element={<PostJobForm />} />
        <Route path="/preview-job/:jobId" element={<PreviewJobs />} />
        <Route path="/active-jobs" element={<ActiveJobs />} />
        <Route path="/closed-jobs" element={<ClosedJobs />} />
        <Route path="/all-candidates-list" element={<AllCandidate />} />
        <Route path="/view-candidate-details/:candidateId" element={<ViewCandidateDetails />} />
        <Route path="/chat-page" element={<ChatPage />} />
        <Route path="/short-listed-candidate" element={<ShortListedCandidate />} />
         <Route path="/hired-candidate" element={<HiredCandidates />} />
          <Route path="/interview-sheduled-candidate" element={<InterViewSheduledCandidate />} />
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
