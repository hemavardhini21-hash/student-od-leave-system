import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

// Public self-registration is for students only; other roles are created by the Admin.
const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    registerNumber: "",
    year: "",
    section: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register({ ...form, role: "student" });
      toast.success("Account created successfully!");
      navigate(`/${user.role}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-parchment p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-card border border-ink-50 border-t-2 border-t-campus-600 p-8 sm:p-10">
        <h2 className="text-xl font-semibold text-ink-800 mb-1">Create your student account</h2>
        <p className="text-sm text-slate-500 mb-6">Faculty, HOD, and Admin accounts are created by the Administrator.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input name="name" className="input" required value={form.name} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Register Number</label>
              <input name="registerNumber" className="input" required value={form.registerNumber} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="label">Email</label>
            <input type="email" name="email" className="input" required value={form.email} onChange={handleChange} />
          </div>

          <div>
            <label className="label">Password</label>
            <input type="password" name="password" className="input" required minLength={6} value={form.password} onChange={handleChange} />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="label">Department</label>
              <input name="department" className="input" required value={form.department} onChange={handleChange} />
            </div>
            <div>
              <label className="label">Year</label>
              <input name="year" className="input" required value={form.year} onChange={handleChange} placeholder="e.g. 3" />
            </div>
            <div>
              <label className="label">Section</label>
              <input name="section" className="input" required value={form.section} onChange={handleChange} placeholder="e.g. A" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
