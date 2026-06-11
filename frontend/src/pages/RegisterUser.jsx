import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import AuthButton from "../components/AuthButton";
import { registerCandidate } from "../lib/api";
import { setAuthSession } from "../lib/userStorage";

const RegisterUser = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerCandidate({
        fullName,
        email,
        password,
        confirmPassword,
      });
      setAuthSession(res);
      navigate("/upload-cv");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
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
        {error ? (
          <p
            className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-center text-xs text-red-300"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <InputField
          label="Full name"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
          autoComplete="name"
          required
        />

        <InputField
          label="Email address"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          autoComplete="new-password"
          required
        />

        <InputField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
        />

        <AuthButton type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </AuthButton>

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
