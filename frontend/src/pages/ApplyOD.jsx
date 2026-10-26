import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import odService from "../services/odService";
import userService from "../services/userService";
import useAuth from "../hooks/useAuth";

const ApplyOD = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    odStartDate: "",
    odEndDate: "",
    eventName: "",
    eventLocation: "",
    reason: "",
    facultyInCharge: "",
  });
  const [document, setDocument] = useState(null);

  useEffect(() => {
    userService.getFaculty(user?.department).then((res) => setFaculty(res.faculty)).catch(() => {});
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(form.odEndDate) < new Date(form.odStartDate)) {
      toast.error("End date cannot be before start date");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (document) fd.append("document", document);

      await odService.create(fd);
      toast.success("OD request submitted successfully!");
      navigate("/student/requests");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit OD request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-ink-800 mb-1">Apply for On-Duty (OD)</h1>
      <p className="text-sm text-slate-500 mb-6">Fill in the details of the event you'll be attending.</p>

      <form onSubmit={handleSubmit} className="card max-w-3xl space-y-5">
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="label">Student Name</p>
            <p className="text-ink-700">{user?.name}</p>
          </div>
          <div>
            <p className="label">Register Number</p>
            <p className="text-ink-700">{user?.registerNumber}</p>
          </div>
          <div>
            <p className="label">Department</p>
            <p className="text-ink-700">{user?.department}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">OD Start Date</label>
            <input type="date" name="odStartDate" className="input" required value={form.odStartDate} onChange={handleChange} />
          </div>
          <div>
            <label className="label">OD End Date</label>
            <input type="date" name="odEndDate" className="input" required value={form.odEndDate} onChange={handleChange} />
          </div>
        </div>

        <div>
          <label className="label">Event Name</label>
          <input name="eventName" className="input" required value={form.eventName} onChange={handleChange} placeholder="e.g. National Hackathon" />
        </div>

        <div>
          <label className="label">Event Location</label>
          <input name="eventLocation" className="input" required value={form.eventLocation} onChange={handleChange} placeholder="e.g. IIT Madras" />
        </div>

        <div>
          <label className="label">Reason</label>
          <textarea name="reason" className="input" rows={3} required value={form.reason} onChange={handleChange} />
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
          {loading ? "Submitting..." : "Submit OD Request"}
        </button>
      </form>
    </DashboardLayout>
  );
};

export default ApplyOD;
