import { useEffect, useState } from "react";
import {
  getUsers,
  getAuditLogs,
} from "../services/adminService";
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

        const accessToken =
          await getAccessToken();

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

  if (!isAdmin) {
    return <AccessDenied onBack={onBack} />;
  }

  const adopterCount = users.filter((user) =>
    user.roles?.includes("Adopter")
  ).length;

  const shelterStaffCount = users.filter((user) =>
    user.roles?.includes("Shelter Staff")
  ).length;

  const adminCount = users.filter((user) =>
    user.roles?.includes("Admin")
  ).length;

  const getRoleClassName = (role) => {
    const normalizedRole = String(
      role || ""
    ).toLowerCase();

    if (normalizedRole.includes("admin")) {
      return "admin-role-badge admin-role-admin";
    }

    if (
      normalizedRole.includes("shelter")
    ) {
      return "admin-role-badge admin-role-staff";
    }

    return "admin-role-badge admin-role-adopter";
  };

  const getAuditIcon = (category) => {
    const normalizedCategory = String(
      category || ""
    ).toLowerCase();

    if (
      normalizedCategory.includes("pet")
    ) {
      return "🐾";
    }

    if (
      normalizedCategory.includes("adoption")
    ) {
      return "📋";
    }

    if (
      normalizedCategory.includes("auth")
    ) {
      return "🔐";
    }

    return "📝";
  };

  return (
    <section>
      <div className="page-heading-row">
        <div>
          <p className="page-eyebrow">
            Administration and monitoring
          </p>

          <h2 className="page-title">
            Admin Dashboard
          </h2>

          <p className="page-subtitle">
            Review user roles, account status and
            recent system activity.
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
          <div className="admin-summary-grid">
            <article className="admin-summary-card">
              <span className="admin-summary-icon">
                👥
              </span>

              <div>
                <p>Total Users</p>
                <strong>{users.length}</strong>
              </div>
            </article>

            <article className="admin-summary-card">
              <span className="admin-summary-icon">
                🏠
              </span>

              <div>
                <p>Adopters</p>
                <strong>{adopterCount}</strong>
              </div>
            </article>

            <article className="admin-summary-card">
              <span className="admin-summary-icon">
                🐾
              </span>

              <div>
                <p>Shelter Staff</p>
                <strong>{shelterStaffCount}</strong>
              </div>
            </article>

            <article className="admin-summary-card">
              <span className="admin-summary-icon">
                🛡️
              </span>

              <div>
                <p>Administrators</p>
                <strong>{adminCount}</strong>
              </div>
            </article>
          </div>

          <div className="admin-section">
            <div className="admin-section-heading">
              <div>
                <h3>User Management</h3>
                <p>
                  Simulated user accounts and
                  assigned roles.
                </p>
              </div>

              <span className="results-summary">
                {users.length} users
              </span>
            </div>

            {users.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  👥
                </div>
                <h3>No users found</h3>
                <p>
                  User records are not available.
                </p>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-user-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="admin-user-cell">
                            <span className="admin-user-avatar">
                              {String(
                                user.name || "U"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </span>

                            <strong>
                              {user.name}
                            </strong>
                          </div>
                        </td>

                        <td>{user.email}</td>

                        <td>
                          <div className="admin-role-list">
                            {(user.roles || []).map(
                              (role) => (
                                <span
                                  key={role}
                                  className={getRoleClassName(
                                    role
                                  )}
                                >
                                  {role}
                                </span>
                              )
                            )}
                          </div>
                        </td>

                        <td>
                          <span className="admin-status-active">
                            ●{" "}
                            {user.status ||
                              "Active"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="admin-section">
            <div className="admin-section-heading">
              <div>
                <h3>Recent Audit Activity</h3>
                <p>
                  Live actions recorded during this
                  server session.
                </p>
              </div>

              <span className="results-summary">
                {auditLogs.length} events
              </span>
            </div>

            {auditLogs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  📝
                </div>

                <h3>No audit activity yet</h3>

                <p>
                  Pet creation, deletion and adoption
                  activity will appear here.
                </p>
              </div>
            ) : (
              <div className="audit-list">
                {auditLogs.map((log) => (
                  <article
                    key={log.id}
                    className="audit-item"
                  >
                    <span className="audit-item-icon">
                      {getAuditIcon(log.category)}
                    </span>

                    <div className="audit-item-content">
                      <div className="audit-item-heading">
                        <strong>
                          {log.action}
                        </strong>

                        <span>
                          {log.date} · {log.time}
                        </span>
                      </div>

                      <p>
                        Performed by{" "}
                        <strong>{log.actor}</strong>
                      </p>

                      <span className="audit-category">
                        {log.category}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default AdminDashboardPage;