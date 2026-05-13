import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import AuthButton from "../components/AuthButton";

const RegisterCompany = () => {
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle company registration logic here
    console.log({ companyName, companyEmail, password, confirmPassword });
  };

  return (
    <AuthLayout
      title="Create your company account"
      subtitle="Post jobs, manage applicants, and grow your hiring pipeline."
    >
      <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-900/80 p-1.5 text-xs">
        <Link
          to="/register/user"
          className="flex-1 rounded-lg px-3 py-1.5 text-center font-medium text-slate-300 hover:bg-slate-800/80 hover:text-blue-300 transition"
        >
          As Candidate
        </Link>
        <div className="flex-1 rounded-lg bg-blue-600/10 px-3 py-1.5 text-center font-semibold text-blue-300">
          As Company
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Company name"
          name="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Your company name"
          autoComplete="organization"
        />

        <InputField
          label="Company email"
          name="companyEmail"
          type="email"
          value={companyEmail}
          onChange={(e) => setCompanyEmail(e.target.value)}
          placeholder="name@company.com"
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

        <AuthButton type="submit">Create company account</AuthButton>

        <p className="pt-2 text-center text-xs text-slate-300">
          Already using Wuzzuf to hire?{" "}
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

export default RegisterCompany;

