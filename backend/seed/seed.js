// Seed script: wipes existing data and creates demo accounts + sample requests/attendance
// Run with: npm run seed  (from the backend/ directory)
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const ODRequest = require("../models/ODRequest");
const LeaveRequest = require("../models/LeaveRequest");
const Attendance = require("../models/Attendance");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");

const DEMO_PASSWORD = "Password123";

const seed = async () => {
  try {
    await connectDB();

    console.log("Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      ODRequest.deleteMany({}),
      LeaveRequest.deleteMany({}),
      Attendance.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);

    console.log("Creating demo users...");

    const admin = await User.create({
      name: "System Administrator",
      email: "admin@example.com",
      password: DEMO_PASSWORD,
      role: "admin",
      employeeId: "ADM001",
      department: "Administration",
    });

    const hod = await User.create({
      name: "Dr. Rajesh Kumar",
      email: "hod@example.com",
      password: DEMO_PASSWORD,
      role: "hod",
      employeeId: "HOD001",
      department: "Computer Science",
    });

    const faculty = await User.create({
      name: "Prof. Anita Sharma",
      email: "faculty@example.com",
      password: DEMO_PASSWORD,
      role: "faculty",
      employeeId: "FAC001",
      department: "Computer Science",
    });

    const faculty2 = await User.create({
      name: "Prof. Vikram Singh",
      email: "faculty2@example.com",
      password: DEMO_PASSWORD,
      role: "faculty",
      employeeId: "FAC002",
      department: "Computer Science",
    });

    const coordinator = await User.create({
      name: "Ms. Priya Menon",
      email: "coordinator@example.com",
      password: DEMO_PASSWORD,
      role: "coordinator",
      employeeId: "COORD001",
      department: "Computer Science",
    });

    const student = await User.create({
      name: "Arjun Nair",
      email: "student@example.com",
      password: DEMO_PASSWORD,
      role: "student",
      registerNumber: "CS2023001",
      department: "Computer Science",
      year: "3",
      section: "A",
    });

    const student2 = await User.create({
      name: "Divya Krishnan",
      email: "student2@example.com",
      password: DEMO_PASSWORD,
      role: "student",
      registerNumber: "CS2023002",
      department: "Computer Science",
      year: "3",
      section: "A",
    });

    const student3 = await User.create({
      name: "Karthik Reddy",
      email: "student3@example.com",
      password: DEMO_PASSWORD,
      role: "student",
      registerNumber: "CS2023003",
      department: "Computer Science",
      year: "2",
      section: "B",
    });

    console.log("Creating sample OD requests...");

    const od1 = await ODRequest.create({
      student: student._id,
      studentName: student.name,
      registerNumber: student.registerNumber,
      department: student.department,
      year: student.year,
      section: student.section,
      odStartDate: new Date("2026-09-05"),
      odEndDate: new Date("2026-09-06"),
      eventName: "National Level Hackathon",
      eventLocation: "IIT Madras",
      reason: "Representing college in a national hackathon",
      facultyInCharge: faculty._id,
      status: "Pending",
    });

    const od2 = await ODRequest.create({
      student: student2._id,
      studentName: student2.name,
      registerNumber: student2.registerNumber,
      department: student2.department,
      year: student2.year,
      section: student2.section,
      odStartDate: new Date("2026-08-20"),
      odEndDate: new Date("2026-08-20"),
      eventName: "Technical Symposium",
      eventLocation: "Anna University",
      reason: "Presenting a paper at the symposium",
      facultyInCharge: faculty._id,
      hod: hod._id,
      status: "Attendance Updated",
      facultyRemarks: "Approved, good initiative",
      hodRemarks: "Approved",
      attendanceUpdated: true,
    });

    console.log("Creating sample Leave requests...");

    const leave1 = await LeaveRequest.create({
      student: student3._id,
      studentName: student3.name,
      registerNumber: student3.registerNumber,
      department: student3.department,
      leaveType: "Medical Leave",
      startDate: new Date("2026-08-25"),
      endDate: new Date("2026-08-27"),
      numberOfDays: 3,
      reason: "Fever and viral infection",
      emergencyContact: "9876543210",
      facultyInCharge: faculty2._id,
      status: "Pending",
    });

    console.log("Creating attendance for the fully processed OD request...");
    await Attendance.create({
      student: student2._id,
      date: new Date("2026-08-20"),
      subject: "General",
      status: "OD",
      faculty: faculty._id,
      relatedRequestId: od2._id,
      relatedRequestModel: "ODRequest",
    });

    await AuditLog.create({
      requestId: od2._id,
      requestType: "ODRequest",
      student: student2._id,
      previousStatus: "Not Marked",
      newStatus: "OD",
      updatedBy: hod._id,
    });

    // A few regular attendance records
    await Attendance.create([
      { student: student._id, date: new Date("2026-08-18"), subject: "General", status: "Present" },
      { student: student._id, date: new Date("2026-08-19"), subject: "General", status: "Present" },
      { student: student3._id, date: new Date("2026-08-18"), subject: "General", status: "Present" },
    ]);

    console.log("Creating sample notifications...");
    await Notification.create([
      { user: student._id, message: "Your OD request for National Level Hackathon has been submitted.", type: "OD" },
      { user: faculty._id, message: "New OD request submitted by Arjun Nair.", type: "OD" },
      { user: student2._id, message: "Attendance updated to OD for your approved request.", type: "Attendance" },
      { user: student3._id, message: "Your Medical Leave request has been submitted.", type: "Leave" },
    ]);

    console.log("\n✅ Seed data created successfully!\n");
    console.log("Demo credentials (password for all: Password123):");
    console.log("  Admin:       admin@example.com");
    console.log("  HOD:         hod@example.com");
    console.log("  Faculty:     faculty@example.com");
    console.log("  Faculty 2:   faculty2@example.com");
    console.log("  Coordinator: coordinator@example.com");
    console.log("  Student:     student@example.com");
    console.log("  Student 2:   student2@example.com");
    console.log("  Student 3:   student3@example.com\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
