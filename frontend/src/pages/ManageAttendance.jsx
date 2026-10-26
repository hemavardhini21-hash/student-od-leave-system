import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import Loader from "../components/Loader";
import attendanceService from "../services/attendanceService";
import adminService from "../services/adminService";

const STATUS_OPTIONS = ["Present", "Absent", "OD", "Leave"];

const ManageAttendance = () => {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ student: "", date: "", subject: "General", status: "Present" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [attRes, userRes] = await Promise.all([attendanceService.getAll(), adminService.getUsers({ role: "student" })]);
      setRecords(attRes.records);
      setStudents(userRes.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCorrect = async (id, newStatus) => {
    try {
      await attendanceService.update(id, { status: newStatus });
      toast.success("Attendance updated");
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await attendanceService.create(form);
      toast.success("Attendance record created");
      setShowForm(false);
      setForm({ student: "", date: "", subject: "General", status: "Present" });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create record");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "student", label: "Student", render: (r) => (
        <div>
          <p className="font-medium text-ink-800">{r.student?.name}</p>
          <p className="text-xs text-slate-400">{r.student?.department}</p>
        </div>
      ) },
    { key: "date", label: "Date", render: (r) => new Date(r.date).toLocaleDateString() },
    { key: "subject", label: "Subject" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions",
      label: "Correct",
      render: (r) =>
        editingId === r._id ? (
          <select className="input !w-auto !py-1" defaultValue={r.status} autoFocus onBlur={() => setEditingId(null)} onChange={(e) => handleCorrect(r._id, e.target.value)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        ) : (
          <button className="btn-secondary !px-3 !py-1.5 text-xs" onClick={() => setEditingId(r._id)}>Edit</button>
        ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-ink-800 mb-1">Manage Attendance</h1>
          <p className="text-sm text-slate-500">View, add, and correct attendance records across the institution.</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Record</button>
      </div>

      <div className="card">
        {loading ? <Loader /> : <DataTable columns={columns} data={records} loading={false} emptyMessage="No attendance records found" />}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Add Attendance Record</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="label">Student</label>
                <select className="input" required value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })}>
                  <option value="">Select student</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>{s.name} ({s.registerNumber})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Date</label>
                <input type="date" className="input" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className="label">Subject</label>
                <input className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageAttendance;
