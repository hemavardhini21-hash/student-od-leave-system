import React, { useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import authService from "../services/authService";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    department: user?.department || "",
    year: user?.year || "",
    section: user?.section || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.updateProfile(form);
      updateUser(res.user);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-ink-800 mb-6">My Profile</h1>

      <div className="card max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-ink-800">{user?.name}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input name="name" className="input" value={form.name} onChange={handleChange} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="label">Register Number</label>
              <p className="text-ink-600 px-3 py-2 bg-parchment-100 rounded-lg">{user?.registerNumber || "N/A"}</p>
            </div>
            <div>
              <label className="label">Employee ID</label>
              <p className="text-ink-600 px-3 py-2 bg-parchment-100 rounded-lg">{user?.employeeId || "N/A"}</p>
            </div>
          </div>

          <div>
            <label className="label">Department</label>
            <input name="department" className="input" value={form.department} onChange={handleChange} />
          </div>

          {user?.role === "student" && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Year</label>
                <input name="year" className="input" value={form.year} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Section</label>
                <input name="section" className="input" value={form.section} onChange={handleChange} />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
