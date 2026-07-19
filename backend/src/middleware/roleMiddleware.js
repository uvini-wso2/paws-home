export const requireShelterStaff = (req, res, next) => {
  const userRoles = Array.isArray(req.user.roles)
    ? req.user.roles
    : String(req.user.roles || "")
        .split(",")
        .map((role) => role.trim());

  if (!userRoles.includes("Shelter Staff")) {
    return res.status(403).json({
      message:
        "Access denied. Shelter Staff role is required.",
    });
  }

  next();
};

export const requireAdmin = (req, res, next) => {
  const userRoles = Array.isArray(req.user.roles)
    ? req.user.roles
    : String(req.user.roles || "")
        .split(",")
        .map((role) => role.trim());

  if (!userRoles.includes("Admin")) {
    return res.status(403).json({
      message:
        "Access denied. Admin role is required.",
    });
  }

  next();
};