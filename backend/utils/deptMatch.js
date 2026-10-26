// Builds a case-insensitive, whitespace-tolerant Mongo filter value for matching
// a department name. Prevents subtle RBAC bugs like "Computer Science" vs
// "computer science " never matching each other.
const deptFilter = (department) => {
  const trimmed = (department || "").trim();
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return { $regex: `^${escaped}$`, $options: "i" };
};

// Plain-JS equivalent for comparing two already-fetched department strings
const deptEquals = (a, b) => (a || "").trim().toLowerCase() === (b || "").trim().toLowerCase();

module.exports = { deptFilter, deptEquals };
