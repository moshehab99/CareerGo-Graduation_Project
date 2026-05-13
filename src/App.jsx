


import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterUser from "./pages/RegisterUser";
import RegisterCompany from "./pages/RegisterCompany";
import UploadCV from "./pages/UploadCV";
import CareerInterests from "./pages/CareerInterests";
import Explore from "./pages/Explore";
import SavedJobs from "./pages/SavedJobs";
import Applications from "./pages/Applications";

function App() {
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
        <Route path="/saved" element={<SavedJobs />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

