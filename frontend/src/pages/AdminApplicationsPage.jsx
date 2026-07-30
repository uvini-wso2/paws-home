import { useEffect, useState } from "react";
import { getAuditLogs, updateApplicationStatus } from "../services/adminService";

function AdminApplicationsPage({ getAccessToken }) {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    const token = await getAccessToken();
    const data = await getAuditLogs(token);
    setApplications(data);
  };

  const handleUpdate = async (id, status) => {
    const token = await getAccessToken();

    await updateApplicationStatus(id, status, token);

    loadApplications(); // refresh
  };

  return (
    <div>
      <h2>Admin - Applications</h2>

      {applications.map((app) => (
        <div key={app.id}>
          <p>{app.petName} - {app.userEmail}</p>
          <p>Status: {app.status}</p>

          <button onClick={() => handleUpdate(app.id, "Approved")}>
            Approve
          </button>

          <button onClick={() => handleUpdate(app.id, "Rejected")}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminApplicationsPage;