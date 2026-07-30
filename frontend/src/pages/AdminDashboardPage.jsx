import { useEffect, useState } from "react";
import {
  getUsers,
  getAuditLogs,
} from "../services/adminService";
import { updateApplicationStatus } from "../services/applicationService";
import AccessDenied from "../components/AccessDenied";

function AdminDashboardPage({
  onBack,
  getAccessToken,
  isAdmin,
}) {
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] =
    useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setDashboardError("");

        const accessToken = await getAccessToken();

        const [userData, auditData] =
          await Promise.all([
            getUsers(accessToken),
            getAuditLogs(accessToken),
          ]);

        setUsers(userData);
        setAuditLogs(auditData);
      } catch (error) {
        console.error(
          "Failed to load admin dashboard:",
          error
        );

        setDashboardError(
          error instanceof Error
            ? error.message
            : "Unable to load the admin dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      loadDashboard();
    }
  }, [getAccessToken, isAdmin]);

  const handleStatusUpdate = async (id, status) => {
    console.log("CLICKED", id, status);

    try {
      const token = await getAccessToken();

      await updateApplicationStatus(id, status, token);

      // refresh logs after update
      const updatedLogs = await getAuditLogs(token);
      setAuditLogs(updatedLogs);
      
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (!isAdmin) {
    return <AccessDenied onBack={onBack} />;
  }

  const adopterCount = users.filter(
    (user) => user.role === "Adopter"
  ).length;

  const shelterStaffCount = users.filter(
    (user) => user.role === "Shelter Staff"
  ).length;

  const adminCount = users.filter(
    (user) => user.role === "Admin"
  ).length;

  const getRoleClassName = (role) => {
    const normalizedRole = String(role || "").toLowerCase();

    if (normalizedRole.includes("admin")) {
      return "admin-role-badge admin-role-admin";
    }

    if (normalizedRole.includes("shelter")) {
      return "admin-role-badge admin-role-staff";
    }

    return "admin-role-badge admin-role-adopter";
  };

  return (
    <section>
      <div className="dashboard-hero">
        <div>
          <p className="dashboard-eyebrow">
            Administration
          </p>

          <h2 className="dashboard-title">
            🛡 Admin Dashboard
          </h2>

          <p className="dashboard-description">
            Manage users and monitor system activity.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={onBack}
        >
          ← Back to Home
        </button>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Loading admin dashboard...</p>
        </div>
      )}

      {dashboardError && (
        <div className="alert alert-error">
          {dashboardError}
        </div>
      )}

      {!loading && !dashboardError && (
        <>
          {/* SUMMARY */}
          <div className="admin-summary-grid">
            <article className="admin-summary-card">
              👥 <strong>{users.length}</strong>
              <p>Total Users</p>
            </article>

            <article className="admin-summary-card">
              🏠 <strong>{adopterCount}</strong>
              <p>Adopters</p>
            </article>

            <article className="admin-summary-card">
              🐾 <strong>{shelterStaffCount}</strong>
              <p>Shelter Staff</p>
            </article>

            <article className="admin-summary-card">
              🛡 <strong>{adminCount}</strong>
              <p>Admins</p>
            </article>
          </div>

          {/* USERS TABLE */}
          <div className="admin-section">
            <h3>User Management</h3>

            <table className="admin-user-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.userEmail || user.email}</td>

                    <td>
                      <span
                        className={getRoleClassName(user.role)}
                      >
                        {user.role || "User"}
                      </span>
                    </td>

                    <td>{user.status || "Active"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AUDIT LOGS */}
          <div className="admin-section">
            <h3>Recent Audit Activity</h3>

            {auditLogs.length === 0 ? (
              <p>No activity yet</p>
            ) : (
              auditLogs.map((log) => {
                const dateObj = new Date(log.createdAt);

                return (
                  <div key={log.id} className="audit-item">
                    <strong>
                      {log.status} - {log.name}
                    </strong>

                    <p>
                      Performed by{" "}
                      <strong>
                        {log.userEmail || "Unknown"}
                      </strong>
                    </p>

                    <small>
                      {dateObj.toLocaleDateString()}{" "}
                      {dateObj.toLocaleTimeString()}
                    </small>

                    {/* 🔥 ACTION BUTTONS */}
                    <div style={{ marginTop: "10px" }}>
                      <button
                        className="primary-button"
                        onClick={() =>
                          handleStatusUpdate(
                            log.id,
                            "Approved"
                          )
                        }
                        disabled={
                          log.status === "Approved"
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="secondary-button"
                        style={{ marginLeft: "10px" }}
                        onClick={() =>
                          handleStatusUpdate(
                            log.id,
                            "Rejected"
                          )
                        }
                        disabled={
                          log.status === "Rejected"
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default AdminDashboardPage;