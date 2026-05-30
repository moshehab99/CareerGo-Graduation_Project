import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import AuthButton from "../components/AuthButton";
import { ROLE_CANDIDATE, setUserRole } from "../lib/userStorage";

const RegisterUser = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserRole(ROLE_CANDIDATE);
    navigate("/upload-cv");
  };

  return (
    <AuthLayout
      title="Create your candidate account"
      subtitle="Find jobs, track applications, and get matched with top companies."
    >
      <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-900/80 p-1.5 text-xs">
        <div className="flex-1 rounded-lg bg-blue-600/10 px-3 py-1.5 text-center font-semibold text-blue-300">
          As Candidate
        </div>
        <Link
          to="/register/company"
          className="flex-1 rounded-lg px-3 py-1.5 text-center font-medium text-slate-300 hover:bg-slate-800/80 hover:text-emerald-300 transition"
        >
          As Company
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Full name"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
          autoComplete="name"
        />

        <InputField
          label="Email address"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          autoComplete="new-password"
        />

        <InputField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
          autoComplete="new-password"
        />

        <AuthButton type="submit">Create account</AuthButton>

        <p className="pt-2 text-center text-xs text-slate-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default RegisterUser;

