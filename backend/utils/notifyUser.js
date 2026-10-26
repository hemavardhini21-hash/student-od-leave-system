const Notification = require("../models/Notification");

// Helper to create an in-app notification for a user. Fails silently (logs) so
// notification errors never break the main request flow.
const notifyUser = async (userId, message, type = "General") => {
  try {
    if (!userId) return;
    await Notification.create({ user: userId, message, type });
  } catch (error) {
    console.error("Failed to create notification:", error.message);
  }
};

module.exports = notifyUser;
