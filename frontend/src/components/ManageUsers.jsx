import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DataTable from "./DataTable";
import Loader from "./Loader";
import ConfirmDialog from "./ConfirmDialog";
import adminService from "../services/adminService";

// Generic CRUD table for managing users of a given role (student / faculty / hod / coordinator).
// Used by the Admin "Manage Students" and "Manage Faculty" pages.
const ManageUsers = ({ role, title, extraFields = [] }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    registerNumber: "",
    employeeId: "",
    year: "",
    section: "",
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({ role, search: search || undefined });
      setUsers(res.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  const openCreate = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", password: "", department: "", registerNumber: "", employeeId: "", year: "", section: "" });
    setShowForm(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      department: user.department || "",
      registerNumber: user.registerNumber || "",
      employeeId: user.employeeId || "",
      year: user.year || "",
      section: user.section || "",
    });
    setShowForm(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingUser) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await adminService.updateUser(editingUser._id, payload);
        toast.success("User updated");
      } else {
        await adminService.createUser({ ...form, role });
        toast.success("User created");
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteUser(deleteTarget._id);
      toast.success("User deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    ...(role === "student" ? [
      { key: "registerNumber", label: "Register No." },
      { key: "year", label: "Year" },
      { key: "section", label: "Section" },
    ] : [
      { key: "employeeId", label: "Employee ID" },
    ]),
    { key: "isActive", label: "Status", render: (u) => (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${u.isActive ? "bg-emerald-100 text-emerald-700" : "bg-ink-100 text-ink-600"}`}>
          {u.isActive ? "Active" : "Inactive"}
        </span>
      ) },
    { key: "actions", label: "Actions", render: (u) => (
        <div className="flex gap-2">
          <button className="btn-secondary !px-3 !py-1.5 text-xs" onClick={() => openEdit(u)}>Edit</button>
          <button className="btn-danger !px-3 !py-1.5 text-xs" onClick={() => setDeleteTarget(u)}>Delete</button>
        </div>
      ) },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input className="input !w-64" placeholder={`Search ${title.toLowerCase()}...`} value={search} onChange={(e) => setSearch(e.target.value)} />
          <button className="btn-secondary" type="submit">Search</button>
        </form>
        <button className="btn-primary" onClick={openCreate}>+ Add {title}</button>
      </div>

      <div className="card">
        {loading ? <Loader /> : <DataTable columns={columns} data={users} loading={false} emptyMessage={`No ${title.toLowerCase()} found`} />}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editingUser ? `Edit ${title}` : `Add New ${title}`}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="label">Name</label>
                <input name="name" className="input" required value={form.name} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Email</label>
                <input type="email" name="email" className="input" required value={form.email} onChange={handleChange} disabled={!!editingUser} />
              </div>
              <div>
                <label className="label">{editingUser ? "New Password (leave blank to keep unchanged)" : "Password"}</label>
                <input type="password" name="password" className="input" required={!editingUser} minLength={6} value={form.password} onChange={handleChange} />
              </div>
              <div>
                <label className="label">Department</label>
                <input name="department" className="input" required value={form.department} onChange={handleChange} />
              </div>
              {role === "student" ? (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="label">Register No.</label>
                    <input name="registerNumber" className="input" required value={form.registerNumber} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="label">Year</label>
                    <input name="year" className="input" value={form.year} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="label">Section</label>
                    <input name="section" className="input" value={form.section} onChange={handleChange} />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="label">Employee ID</label>
                  <input name="employeeId" className="input" value={form.employeeId} onChange={handleChange} />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete User"
          description={`Are you sure you want to permanently delete ${deleteTarget.name}? This cannot be undone.`}
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default ManageUsers;
