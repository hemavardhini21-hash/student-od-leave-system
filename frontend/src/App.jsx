import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuth from "./hooks/useAuth";

import Login from "./pages/Login";
import Register from "./pages/Register";

import StudentDashboard from "./pages/StudentDashboard";
import ApplyOD from "./pages/ApplyOD";
import ApplyLeave from "./pages/ApplyLeave";
import MyRequests from "./pages/MyRequests";
import StudentAttendance from "./pages/StudentAttendance";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

import FacultyDashboard from "./pages/FacultyDashboard";
import FacultyPendingRequests from "./pages/FacultyPendingRequests";
import FacultyHistory from "./pages/FacultyHistory";
import RequestDetails from "./pages/RequestDetails";

import HODDashboard from "./pages/HODDashboard";
import HODPendingApprovals from "./pages/HODPendingApprovals";
import HODDeptRequests from "./pages/HODDeptRequests";

import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import CoordinatorApprovedRequests from "./pages/CoordinatorApprovedRequests";
import CoordinatorAttendanceRecords from "./pages/CoordinatorAttendanceRecords";
import CoordinatorHistory from "./pages/CoordinatorHistory";

import AdminDashboard from "./pages/AdminDashboard";
import ManageStudents from "./pages/ManageStudents";
import ManageFaculty from "./pages/ManageFaculty";
import ManageDepartments from "./pages/ManageDepartments";
import ManageAttendance from "./pages/ManageAttendance";
import Reports from "./pages/Reports";

import Loader from "./components/Loader";

// Redirects "/" to the correct dashboard based on auth state / role
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <Loader label="Loading application..." />;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}`} replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student routes */}
      <Route path="/student" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/apply-od" element={<ProtectedRoute allowedRoles={["student"]}><ApplyOD /></ProtectedRoute>} />
      <Route path="/student/apply-leave" element={<ProtectedRoute allowedRoles={["student"]}><ApplyLeave /></ProtectedRoute>} />
      <Route path="/student/requests" element={<ProtectedRoute allowedRoles={["student"]}><MyRequests /></ProtectedRoute>} />
      <Route path="/student/attendance" element={<ProtectedRoute allowedRoles={["student"]}><StudentAttendance /></ProtectedRoute>} />
      <Route path="/student/notifications" element={<ProtectedRoute allowedRoles={["student"]}><Notifications /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute allowedRoles={["student"]}><Profile /></ProtectedRoute>} />

      {/* Faculty routes */}
      <Route path="/faculty" element={<ProtectedRoute allowedRoles={["faculty"]}><FacultyDashboard /></ProtectedRoute>} />
      <Route path="/faculty/pending" element={<ProtectedRoute allowedRoles={["faculty"]}><FacultyPendingRequests /></ProtectedRoute>} />
      <Route path="/faculty/history" element={<ProtectedRoute allowedRoles={["faculty"]}><FacultyHistory /></ProtectedRoute>} />
      <Route path="/faculty/notifications" element={<ProtectedRoute allowedRoles={["faculty"]}><Notifications /></ProtectedRoute>} />
      <Route path="/faculty/request/:type/:id" element={<ProtectedRoute allowedRoles={["faculty", "hod", "admin"]}><RequestDetails /></ProtectedRoute>} />

      {/* HOD routes */}
      <Route path="/hod" element={<ProtectedRoute allowedRoles={["hod"]}><HODDashboard /></ProtectedRoute>} />
      <Route path="/hod/pending" element={<ProtectedRoute allowedRoles={["hod"]}><HODPendingApprovals /></ProtectedRoute>} />
      <Route path="/hod/department" element={<ProtectedRoute allowedRoles={["hod"]}><HODDeptRequests /></ProtectedRoute>} />
      <Route path="/hod/notifications" element={<ProtectedRoute allowedRoles={["hod"]}><Notifications /></ProtectedRoute>} />
      <Route path="/hod/request/:type/:id" element={<ProtectedRoute allowedRoles={["faculty", "hod", "admin"]}><RequestDetails /></ProtectedRoute>} />

      {/* Attendance Coordinator routes */}
      <Route path="/coordinator" element={<ProtectedRoute allowedRoles={["coordinator"]}><CoordinatorDashboard /></ProtectedRoute>} />
      <Route path="/coordinator/approved" element={<ProtectedRoute allowedRoles={["coordinator"]}><CoordinatorApprovedRequests /></ProtectedRoute>} />
      <Route path="/coordinator/attendance" element={<ProtectedRoute allowedRoles={["coordinator"]}><CoordinatorAttendanceRecords /></ProtectedRoute>} />
      <Route path="/coordinator/history" element={<ProtectedRoute allowedRoles={["coordinator"]}><CoordinatorHistory /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute allowedRoles={["admin"]}><ManageStudents /></ProtectedRoute>} />
      <Route path="/admin/faculty" element={<ProtectedRoute allowedRoles={["admin"]}><ManageFaculty /></ProtectedRoute>} />
      <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={["admin"]}><ManageDepartments /></ProtectedRoute>} />
      <Route path="/admin/attendance" element={<ProtectedRoute allowedRoles={["admin"]}><ManageAttendance /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={["admin"]}><Reports /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
