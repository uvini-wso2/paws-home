import { useEffect, useState } from "react";
import { getPets } from "../services/petService";
import AccessDenied from "../components/AccessDenied";
import { createApplication } from "../services/applicationService";

function BrowsePetsPage({
  onBack,
  getAccessToken,
  isAdopter,
}) {
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [petsError, setPetsError] = useState("");

  const [applyingPetId, setApplyingPetId] = useState(null);
  const [applicationMessage, setApplicationMessage] =
    useState("");
  const [applicationError, setApplicationError] =
    useState("");

  useEffect(() => {
    const loadPets = async () => {
      try {
        setLoadingPets(true);
        setPetsError("");

        const accessToken = await getAccessToken();
        const petData = await getPets(accessToken);

        setPets(petData);
      } catch (error) {
        console.error("Failed to load pets:", error);

        setPetsError(
          error instanceof Error
            ? error.message
            : "Unable to load pets."
        );
      } finally {
        setLoadingPets(false);
      }
    };

    loadPets();
  }, [getAccessToken]);

  const handleApply = async (pet) => {
    try {
      setApplyingPetId(pet.id);
      setApplicationMessage("");
      setApplicationError("");

      const accessToken = await getAccessToken();

      await createApplication(pet.id, accessToken);

      setApplicationMessage(
        `Your adoption application for ${pet.name} was submitted successfully.`
      );
    } catch (error) {
      console.error("Failed to submit application:", error);

      setApplicationError(
        error instanceof Error
          ? error.message
          : "Unable to submit the adoption application."
      );
    } finally {
      setApplyingPetId(null);
    }
  };

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

  const getStatusClassName = (status) => {
    const normalizedStatus = String(
      status || ""
    ).toLowerCase();

    if (
      normalizedStatus.includes("available") ||
      normalizedStatus.includes("active")
    ) {
      return "pet-status pet-status-available";
    }

    if (
      normalizedStatus.includes("pending") ||
      normalizedStatus.includes("reserved")
    ) {
      return "pet-status pet-status-pending";
    }

    return "pet-status";
  };

  return (
    <section>
      <div className="page-heading-row">
        <div>
          <p className="page-eyebrow">
            Find your new companion
          </p>

          <h2 className="page-title">
            Browse Pets
          </h2>

          <p className="page-subtitle">
            Explore pets currently looking for a safe and
            loving home.
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

      {loadingPets && (
        <div className="loading-state">
          <div className="loading-spinner" />

          <p>Loading available pets...</p>
        </div>
      )}

      {petsError && (
        <div className="alert alert-error">
          {petsError}
        </div>
      )}

      {applicationMessage && (
        <div className="alert alert-success">
          {applicationMessage}
        </div>
      )}

      {applicationError && (
        <div className="alert alert-error">
          {applicationError}
        </div>
      )}

      {!loadingPets &&
        !petsError &&
        pets.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🐾</div>

            <h3>No pets available yet</h3>

            <p>
              Please check again later for new adoption
              listings.
            </p>
          </div>
        )}

      {!loadingPets &&
        !petsError &&
        pets.length > 0 && (
          <>
            <div className="results-summary">
              <span>
                {pets.length}{" "}
                {pets.length === 1 ? "pet" : "pets"} found
              </span>
            </div>

            <div className="pet-grid">
              {pets.map((pet) => (
                <article
                  key={pet.id}
                  className="pet-card"
                >
                  <div className="pet-card-visual">
                    <span className="pet-card-emoji">
                      {getPetEmoji(pet.species)}
                    </span>

                    <span
                      className={getStatusClassName(
                        pet.status
                      )}
                    >
                      {pet.status || "Available"}
                    </span>
                  </div>

                  <div className="pet-card-body">
                    <div className="pet-card-heading">
                      <div>
                        <h3>{pet.name}</h3>

                        <p>
                          {pet.breed ||
                            "Breed not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="pet-details">
                      <div className="pet-detail-item">
                        <span>Species</span>
                        <strong>
                          {pet.species ||
                            "Not specified"}
                        </strong>
                      </div>

                      <div className="pet-detail-item">
                        <span>Age</span>
                        <strong>
                          {pet.age
                            ? `${pet.age} ${
                                Number(pet.age) === 1
                                  ? "year"
                                  : "years"
                              }`
                            : "Not specified"}
                        </strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="primary-button pet-card-action"
                      onClick={() => handleApply(pet)}
                      disabled={applyingPetId === pet.id}
                    >

                      {applyingPetId === pet.id
                        ? "Submitting..."
                        : "Apply to Adopt"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
    </section>
  );
}

export default BrowsePetsPage;