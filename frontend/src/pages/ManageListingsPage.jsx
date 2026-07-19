import { useEffect, useState } from "react";
import {
  getMyPets,
  deletePet,
} from "../services/petService";
import AccessDenied from "../components/AccessDenied";

function ManageListingsPage({
  onBack,
  getAccessToken,
  isShelterStaff,
}) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMyPets = async () => {
      try {
        setLoading(true);
        setError("");

        const accessToken = await getAccessToken();
        const petData = await getMyPets(accessToken);

        setPets(petData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your listings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMyPets();
  }, [getAccessToken]);

  const handleDelete = async (petId, petName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        petName || "this pet"
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(petId);
      setMessage("");
      setError("");

      const accessToken = await getAccessToken();
      const response = await deletePet(
        petId,
        accessToken
      );

      setPets((currentPets) =>
        currentPets.filter(
          (pet) => pet.id !== petId
        )
      );

      setMessage(
        response?.message ||
          "Pet listing deleted successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete the pet."
      );
    } finally {
      setDeletingId(null);
    }
  };

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

  if (!isShelterStaff) {
    return <AccessDenied onBack={onBack} />;
  }

  return (
    <section>
      <div className="page-heading-row">
        <div>
          <p className="page-eyebrow">
            Shelter dashboard
          </p>

          <h2 className="page-title">
            Manage My Listings
          </h2>

          <p className="page-subtitle">
            Review and remove the pet listings created by
            your shelter account.
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

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Loading your listings...</p>
        </div>
      )}

      {!loading && !error && pets.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>

          <h3>No listings yet</h3>

          <p>
            You have not created any pet listings yet.
          </p>
        </div>
      )}

      {!loading && pets.length > 0 && (
        <>
          <div className="listing-summary">
            <div>
              <span>Active listings</span>
              <strong>{pets.length}</strong>
            </div>

            <p>
              Keep your listings updated so adopters can
              find accurate information.
            </p>
          </div>

          <div className="listing-grid">
            {pets.map((pet) => (
              <article
                key={pet.id}
                className="listing-card"
              >
                <div className="listing-card-visual">
                  <span className="listing-card-emoji">
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

                <div className="listing-card-body">
                  <div className="listing-card-heading">
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
                    className="danger-button listing-delete-button"
                    onClick={() =>
                      handleDelete(
                        pet.id,
                        pet.name
                      )
                    }
                    disabled={deletingId === pet.id}
                  >
                    {deletingId === pet.id
                      ? "Deleting..."
                      : "🗑 Delete Listing"}
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

export default ManageListingsPage;