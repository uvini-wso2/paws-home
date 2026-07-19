import { useEffect, useState } from "react";
import { getMyApplications } from "../services/applicationService";
import AccessDenied from "../components/AccessDenied";

function MyApplicationsPage({
  onBack,
  getAccessToken,
  isAdopter,
}) {
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] =
    useState(true);
  const [applicationsError, setApplicationsError] =
    useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoadingApplications(true);
        setApplicationsError("");

        const accessToken = await getAccessToken();

        const applicationData =
          await getMyApplications(accessToken);

        setApplications(applicationData);
      } catch (error) {
        console.error(
          "Failed to load applications:",
          error
        );

        setApplicationsError(
          error instanceof Error
            ? error.message
            : "Unable to load your applications."
        );
      } finally {
        setLoadingApplications(false);
      }
    };

    if (isAdopter) {
      loadApplications();
    }
  }, [getAccessToken, isAdopter]);

  if (!isAdopter) {
    return <AccessDenied onBack={onBack} />;
  }

  const getPetEmoji = (species) => {
    const normalizedSpecies = String(
      species || ""
    ).toLowerCase();

    if (normalizedSpecies.includes("cat")) {
      return "🐱";
    }

    if (normalizedSpecies.includes("rabbit")) {
      return "🐰";
    }

    if (normalizedSpecies.includes("bird")) {
      return "🐦";
    }

    return "🐶";
  };

  const getApplicationStatusClassName = (status) => {
    const normalizedStatus = String(
      status || ""
    ).toLowerCase();

    if (normalizedStatus.includes("approved")) {
      return "application-status application-status-approved";
    }

    if (
      normalizedStatus.includes("rejected") ||
      normalizedStatus.includes("declined")
    ) {
      return "application-status application-status-rejected";
    }

    return "application-status application-status-pending";
  };

  return (
    <section>
      <div className="page-heading-row">
        <div>
          <p className="page-eyebrow">
            Track your adoption journey
          </p>

          <h2 className="page-title">
            My Applications
          </h2>

          <p className="page-subtitle">
            View the pets you have applied to adopt and
            monitor the status of each application.
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

      {loadingApplications && (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Loading your applications...</p>
        </div>
      )}

      {applicationsError && (
        <div className="alert alert-error">
          {applicationsError}
        </div>
      )}

      {!loadingApplications &&
        !applicationsError &&
        applications.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>

            <h3>No applications yet</h3>

            <p>
              You have not applied to adopt any pets yet.
              Browse the available pets to begin your
              adoption journey.
            </p>
          </div>
        )}

      {!loadingApplications &&
        !applicationsError &&
        applications.length > 0 && (
          <>
            <div className="results-summary">
              <span>
                {applications.length}{" "}
                {applications.length === 1
                  ? "application"
                  : "applications"}{" "}
                submitted
              </span>
            </div>

            <div className="application-grid">
              {applications.map((application) => (
                <article
                  key={application.id}
                  className="application-card"
                >
                  <div className="application-card-header">
                    <span className="application-pet-emoji">
                      {getPetEmoji(application.species)}
                    </span>

                    <span
                      className={getApplicationStatusClassName(
                        application.status
                      )}
                    >
                      {application.status || "Pending"}
                    </span>
                  </div>

                  <div className="application-card-body">
                    <h3>{application.petName}</h3>

                    <p className="application-breed">
                      {application.breed ||
                        "Breed not specified"}
                    </p>

                    <div className="application-details">
                      <div className="application-detail-item">
                        <span>Species</span>

                        <strong>
                          {application.species ||
                            "Not specified"}
                        </strong>
                      </div>

                      <div className="application-detail-item">
                        <span>Applied On</span>

                        <strong>
                          {application.appliedDate ||
                            "Not available"}
                        </strong>
                      </div>

                      <div className="application-detail-item">
                        <span>Application ID</span>

                        <strong>
                          #{application.id}
                        </strong>
                      </div>
                    </div>

                    <div className="application-status-message">
                      {String(
                        application.status || ""
                      ).toLowerCase() === "approved"
                        ? "Your adoption application has been approved."
                        : String(
                              application.status || ""
                            ).toLowerCase() === "rejected"
                          ? "This adoption application was not approved."
                          : "Your application is currently awaiting review."}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
    </section>
  );
}

export default MyApplicationsPage;