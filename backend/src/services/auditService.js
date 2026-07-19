import auditLogs from "../data/auditLogs.js";

export const addAuditLog = ({
  action,
  actor,
  category,
}) => {
  const now = new Date();

  auditLogs.unshift({
    id: Date.now(),
    action,
    actor,
    category,
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
  });
};

export const getAuditLogs = () => auditLogs;