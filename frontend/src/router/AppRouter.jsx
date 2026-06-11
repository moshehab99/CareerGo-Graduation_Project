import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import RegisterUser from "../pages/RegisterUser";
import RegisterCompany from "../pages/RegisterCompany";
import UploadCV from "../pages/UploadCV";
import CareerInterests from "../pages/CareerInterests";
import Explore from "../pages/Explore";
import SavedJobs from "../pages/SavedJobs";
import Applications from "../pages/Applications";
import Profile from "../pages/Profile";
import Internships from "../pages/Internships";
import CompanyProfile from "../pages/CompanyProfile";
import JobDetail from "../pages/JobDetail";
import CompanyDashboard from "../pages/CompanyDashboard";
import CompanyCandidates from "../pages/CompanyCandidates";
import PostJob from "../pages/PostJob";

/**
 * Central route table for the Smart Recruitment Platform (Wuzzuf-inspired demo).
 */
function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/user" element={<RegisterUser />} />
        <Route path="/register/company" element={<RegisterCompany />} />
        <Route path="/upload-cv" element={<UploadCV />} />
        <Route path="/career-interests" element={<CareerInterests />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/saved" element={<SavedJobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/company/:id" element={<CompanyProfile />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/candidates" element={<CompanyCandidates />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route
          path="/company/post-job"
          element={<Navigate to="/post-job" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
