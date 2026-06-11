import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import AuthButton from "../components/AuthButton";
import { loginCandidate, loginCompany } from "../lib/api";
import { setAuthSession } from "../lib/userStorage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginCandidate({ email, password });
      setAuthSession(res);
      navigate("/explore", { replace: true });
    } catch {
      try {
        const res = await loginCompany({ email, password });
        setAuthSession(res);
        navigate("/company/dashboard", { replace: true });
      } catch {
        setError("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your CareerGo account to access personalized job matches."
    >
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
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between text-xs">
          <label className="inline-flex items-center gap-2 text-slate-300">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500/60"
            />
            <span>Keep me signed in</span>
          </label>
          <button
            type="button"
            className="text-xs font-medium text-blue-400 hover:text-blue-300"
          >
            Forgot password?
          </button>
        </div>

        <AuthButton type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Log in"}
        </AuthButton>

        <p className="pt-2 text-center text-xs text-slate-300">
          Don&apos;t have an account?{" "}
          <Link
            to="/register/user"
            className="font-semibold text-blue-400 hover:text-blue-300"
          >
            Create a free account
          </Link>
        </p>

        <p className="text-center text-[11px] text-slate-500">
          Looking to hire?{" "}
          <Link
            to="/register/company"
            className="font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Create a company account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
