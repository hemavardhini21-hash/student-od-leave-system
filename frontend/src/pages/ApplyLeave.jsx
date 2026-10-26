import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import leaveService from "../services/leaveService";
import userService from "../services/userService";
import useAuth from "../hooks/useAuth";

const LEAVE_TYPES = ["Medical Leave", "Personal Leave", "Emergency Leave", "Other"];

const ApplyLeave = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    leaveType: "Medical Leave",
    startDate: "",
    endDate: "",
    reason: "",
    emergencyContact: "",
    facultyInCharge: "",
  });
  const [document, setDocument] = useState(null);

  useEffect(() => {
    userService.getFaculty(user?.department).then((res) => setFaculty(res.faculty)).catch(() => {});
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const numberOfDays = () => {
    if (!form.startDate || !form.endDate) return 0;
    const diff = Math.round((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast.error("End date cannot be before start date");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (document) fd.append("document", document);

      await leaveService.create(fd);
      toast.success("Leave request submitted successfully!");
      navigate("/student/requests");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit leave request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-ink-800 mb-1">Apply for Leave</h1>
      <p className="text-sm text-slate-500 mb-6">Submit a leave request for faculty and HOD approval.</p>

      <form onSubmit={handleSubmit} className="card max-w-3xl space-y-5">
        <div>
          <label className="label">Leave Type</label>
          <select name="leaveType" className="input" value={form.leaveType} onChange={handleChange}>
            {LEAVE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Start Date</label>
            <input type="date" name="startDate" className="input" required value={form.startDate} onChange={handleChange} />
          </div>
          <div>
            <label className="label">End Date</label>
            <input type="date" name="endDate" className="input" required value={form.endDate} onChange={handleChange} />
          </div>
        </div>

        <p className="text-sm text-slate-500">
          Number of Days: <span className="font-semibold text-ink-700">{numberOfDays()}</span>
        </p>

        <div>
          <label className="label">Reason</label>
          <textarea name="reason" className="input" rows={3} required value={form.reason} onChange={handleChange} />
        </div>

        <div>
          <label className="label">Emergency Contact</label>
          <input name="emergencyContact" className="input" required value={form.emergencyContact} onChange={handleChange} placeholder="Phone number" />
        </div>

        <div>
          <label className="label">Faculty In-Charge</label>
          <select name="facultyInCharge" className="input" required value={form.facultyInCharge} onChange={handleChange}>
            <option value="">Select faculty</option>
            {faculty.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Supporting Document (optional)</label>
          <input type="file" className="input" onChange={(e) => setDocument(e.target.files[0])} />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Submitting..." : "Submit Leave Request"}
        </button>
      </form>
    </DashboardLayout>
  );
};

export default ApplyLeave;
