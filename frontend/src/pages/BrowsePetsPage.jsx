import { useEffect, useState } from "react";
import { getPets } from "../services/petService";

function BrowsePetsPage({ onBack }) {
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [petsError, setPetsError] = useState("");

  useEffect(() => {
    const loadPets = async () => {
      try {
        setLoadingPets(true);
        setPetsError("");

        const petData = await getPets();

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
  }, []);

  return (
    <section style={{ textAlign: "center" }}>
      <h2>Browse Pets for Adoption</h2>

      {loadingPets && <p>Loading pets...</p>}

      {petsError && (
        <p style={{ color: "crimson" }}>
          {petsError}
        </p>
      )}

      {!loadingPets &&
        !petsError &&
        pets.length === 0 && (
          <p>No pets are currently available.</p>
        )}

      {!loadingPets &&
        !petsError &&
        pets.length > 0 && (
          <div
            style={{
              display: "grid",
              gap: "16px",
              marginTop: "24px",
              textAlign: "left",
            }}
          >
            {pets.map((pet) => (
              <article
                key={pet.id}
                style={{
                  padding: "20px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow:
                    "0 2px 8px rgba(0, 0, 0, 0.08)",
                }}
              >
                <h3>{pet.name}</h3>

                <p>
                  <strong>Species:</strong>{" "}
                  {pet.species}
                </p>

                <p>
                  <strong>Breed:</strong>{" "}
                  {pet.breed}
                </p>

                <p>
                  <strong>Age:</strong> {pet.age}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {pet.status}
                </p>
              </article>
            ))}
          </div>
        )}

      <button
        type="button"
        onClick={onBack}
        style={{ marginTop: "24px" }}
      >
        Back to Home
      </button>
    </section>
  );
}

export default BrowsePetsPage;