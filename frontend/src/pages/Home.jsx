function Home({
  displayName,
  roles,
  isAdopter,
  isShelterStaff,
  isAdmin,
  onNavigate,
  onOpenSettings,
}) {
  const hasAssignedRole = roles.length > 0;

  return (
    <section>
      <div className="dashboard-hero">
        <div>
          <p className="dashboard-eyebrow">
            Welcome back
          </p>

          <h2 className="dashboard-title">
            Hello, {displayName} 👋
          </h2>

          <p className="dashboard-description">
            Manage your pet adoption activities from one
            secure place.
          </p>
        </div>

        <div className="dashboard-role-panel">
          <span className="dashboard-role-label">
            Your role
          </span>

          <strong>
            {hasAssignedRole
              ? roles.join(", ")
              : "No role assigned"}
          </strong>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <h3>Quick actions</h3>
            <p>
              Choose an option below to continue.
            </p>
          </div>
        </div>

        <div className="dashboard-grid">
          {isAdopter && (
            <>
              <button
                type="button"
                className="dashboard-card"
                onClick={() =>
                  onNavigate("browsePets")
                }
              >
                <span className="dashboard-card-icon">
                  🐶
                </span>

                <span className="dashboard-card-content">
                  <strong>Browse Pets</strong>

                  <span>
                    Discover pets waiting for a safe and
                    loving home.
                  </span>
                </span>

                <span className="dashboard-card-arrow">
                  →
                </span>
              </button>

              <button
                type="button"
                className="dashboard-card"
                onClick={() =>
                  onNavigate("myApplications")
                }
              >
                <span className="dashboard-card-icon">
                  📄
                </span>

                <span className="dashboard-card-content">
                  <strong>My Applications</strong>

                  <span>
                    View and track your adoption requests.
                  </span>
                </span>

                <span className="dashboard-card-arrow">
                  →
                </span>
              </button>
            </>
          )}

          {isShelterStaff && (
            <>
              <button
                type="button"
                className="dashboard-card"
                onClick={() =>
                  onNavigate("addPet")
                }
              >
                <span className="dashboard-card-icon">
                  ➕
                </span>

                <span className="dashboard-card-content">
                  <strong>Add New Pet</strong>

                  <span>
                    Create a new pet adoption listing.
                  </span>
                </span>

                <span className="dashboard-card-arrow">
                  →
                </span>
              </button>

              <button
                type="button"
                className="dashboard-card"
                onClick={() =>
                  onNavigate("manageListings")
                }
              >
                <span className="dashboard-card-icon">
                  📋
                </span>

                <span className="dashboard-card-content">
                  <strong>Manage Listings</strong>

                  <span>
                    Review and remove your pet listings.
                  </span>
                </span>

                <span className="dashboard-card-arrow">
                  →
                </span>
              </button>
            </>
          )}

          {isAdmin && (
            <button
              type="button"
              className="dashboard-card"
              onClick={() =>
                onNavigate("adminDashboard")
              }
            >
              <span className="dashboard-card-icon">
                🛡️
              </span>

              <span className="dashboard-card-content">
                  <strong>Admin Dashboard</strong>

                  <span>
                    Manage users and review audit activity.
                  </span>
              </span>

              <span className="dashboard-card-arrow">
                →
              </span>
            </button>
          )}

          <button
            type="button"
            className="dashboard-card"
            onClick={onOpenSettings}
          >
            <span className="dashboard-card-icon">
              👤
            </span>

            <span className="dashboard-card-content">
              <strong>Profile Settings</strong>

              <span>
                Update your personal and contact
                information.
              </span>
            </span>

            <span className="dashboard-card-arrow">
              →
            </span>
          </button>
        </div>

        {!hasAssignedRole && (
          <div className="alert alert-error">
            No application role has been assigned to this
            account. Please contact an administrator.
          </div>
        )}
      </div>
    </section>
  );
}

export default Home;