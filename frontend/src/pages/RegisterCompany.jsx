import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import AuthButton from "../components/AuthButton";
import { registerCompany } from "../lib/api";
import { setAuthSession } from "../lib/userStorage";

const emptyFieldErrors = () => ({
  companyName: "",
  companyEmail: "",
  password: "",
  confirmPassword: "",
});

const RegisterCompany = () => {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState(emptyFieldErrors);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const clearFieldError = (key) => {
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const next = emptyFieldErrors();
    let hasMissing = false;

    if (!companyName.trim()) {
      next.companyName = "Company name is required.";
      hasMissing = true;
    }
    if (!companyEmail.trim()) {
      next.companyEmail = "Company email is required.";
      hasMissing = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail.trim())) {
      next.companyEmail = "Enter a valid email address.";
      hasMissing = true;
    }
    if (!password) {
      next.password = "Password is required.";
      hasMissing = true;
    }
    if (!confirmPassword) {
      next.confirmPassword = "Please confirm your password.";
      hasMissing = true;
    }

    if (hasMissing) {
      setFieldErrors(next);
      setFormError("Please fix the highlighted fields below.");
      return;
    }

    if (password !== confirmPassword) {
      setFieldErrors({
        ...emptyFieldErrors(),
        password: "Passwords must match.",
        confirmPassword: "Passwords must match.",
      });
      setFormError("Password and confirmation do not match.");
      return;
    }

    setFieldErrors(emptyFieldErrors());
    setFormError("");
    setLoading(true);

    try {
      const res = await registerCompany({
        companyName: companyName.trim(),
        email: companyEmail.trim(),
        password,
        confirmPassword,
      });
      setAuthSession(res);
      navigate("/post-job", { replace: true });
    } catch (err) {
      setFormError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your company account"
      subtitle="Post jobs, manage applicants, and grow your hiring pipeline."
    >
      <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-900/80 p-1.5 text-xs">
        <Link
          to="/register/user"
          className="flex-1 rounded-lg px-3 py-1.5 text-center font-medium text-slate-300 transition hover:bg-slate-800/80 hover:text-blue-300"
        >
          As Candidate
        </Link>
        <div className="flex-1 rounded-lg bg-blue-600/10 px-3 py-1.5 text-center font-semibold text-blue-300">
          As Company
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError ? (
          <p
            className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-center text-xs text-red-300"
            role="alert"
          >
            {formError}
          </p>
        ) : null}

        <InputField
          label="Company name"
          name="companyName"
          value={companyName}
          onChange={(e) => {
            setCompanyName(e.target.value);
            clearFieldError("companyName");
          }}
          placeholder="Your company name"
          autoComplete="organization"
          error={fieldErrors.companyName}
        />

        <InputField
          label="Company email"
          name="companyEmail"
          type="email"
          value={companyEmail}
          onChange={(e) => {
            setCompanyEmail(e.target.value);
            clearFieldError("companyEmail");
          }}
          placeholder="name@company.com"
          autoComplete="email"
          error={fieldErrors.companyEmail}
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearFieldError("password");
          }}
          placeholder="Create a password"
          autoComplete="new-password"
          error={fieldErrors.password}
        />

        <InputField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            clearFieldError("confirmPassword");
          }}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
        />

        <AuthButton type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create company account"}
        </AuthButton>

        <p className="pt-2 text-center text-xs text-slate-300">
          Already using CareerGo to hire?{" "}
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
