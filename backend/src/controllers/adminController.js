import users from "../data/users.js";
import { getAuditLogs } from "../services/auditService.js";

export const getUsers = (req, res) => {
  try {
    return res.status(200).json(users);
  } catch (error) {
    console.error("Failed to retrieve users:", error);

    return res.status(500).json({
      message: "Unable to retrieve users.",
    });
  }
};

export const getAuditActivity = (req, res) => {
  try {
    const auditLogs = getAuditLogs();

    return res.status(200).json(auditLogs);
  } catch (error) {
    console.error("Failed to retrieve audit logs:", error);

    return res.status(500).json({
      message: "Unable to retrieve audit activity.",
    });
  }
};