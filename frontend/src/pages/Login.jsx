import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const DEMO_ACCOUNTS = [
  { role: "Student", email: "student@example.com" },
  { role: "Faculty", email: "faculty@example.com" },
  { role: "HOD", email: "hod@example.com" },
  { role: "Coordinator", email: "coordinator@example.com" },
  { role: "Admin", email: "admin@example.com" },
];

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(`/${user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword("Password123");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-5 bg-white rounded-lg shadow-card border border-ink-50 overflow-hidden">
        <div className="hidden md:flex md:col-span-2 flex-col justify-between bg-campus-700 text-parchment p-10 relative">
          <div>
            <span className="w-10 h-10 rounded-sm bg-white text-campus-700 flex items-center justify-center font-serif font-bold">
              OL
            </span>
            <h1 className="font-serif text-[28px] leading-[1.2] mt-8 mb-4">
              The record of every request, in one register.
            </h1>
            <p className="text-ink-100/70 text-sm leading-relaxed">
              Submit On-Duty and Leave requests, route them through faculty and HOD approval, and
              let attendance update itself — no more chasing signatures over WhatsApp.
            </p>
          </div>
          <div className="border-t border-white/10 pt-4 text-xs text-ink-100/50 tracking-wide">
            Student OD &amp; Leave Approval System
          </div>
        </div>

        <div className="md:col-span-3 p-8 sm:p-10">
          <h2 className="text-xl font-semibold text-ink-800 mb-1">Sign in</h2>
          <p className="text-sm text-slate-500 mb-6">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-4">
            New student?{" "}
            <Link to="/register" className="text-campus-600 font-medium hover:underline">
              Create an account
            </Link>
          </p>

          <div className="mt-6 border-t border-ink-50 pt-4">
            <p className="text-xs font-medium text-slate-500 mb-2">Demo accounts · password Password123</p>
            <div className="flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemo(acc.email)}
                  className="text-xs px-2.5 py-1 rounded-full border border-ink-100 hover:border-brass-400 hover:text-brass-600 text-ink-600 transition-colors"
                >
                  {acc.role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
