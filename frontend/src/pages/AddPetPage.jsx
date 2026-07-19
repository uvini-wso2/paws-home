import { useState } from "react";
import { createPet } from "../services/petService";
import AccessDenied from "../components/AccessDenied";

function AddPetPage({
  onBack,
  getAccessToken,
  isShelterStaff,
}) {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setMessage("");
      setError("");

      const accessToken = await getAccessToken();

      const response = await createPet(
        {
          ...formData,
          age: Number(formData.age),
        },
        accessToken
      );

      setMessage(
        response?.message ||
          `${formData.name} was added successfully.`
      );

      setFormData({
        name: "",
        species: "",
        breed: "",
        age: "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create the pet listing."
      );
    } finally {
      setIsSubmitting(false);
    }
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
            Add New Pet
          </h2>

          <p className="page-subtitle">
            Create a new adoption listing with clear and
            accurate information.
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

      <div className="add-pet-layout">
        <aside className="add-pet-preview">
          <div className="add-pet-preview-icon">
            {formData.species
              .toLowerCase()
              .includes("cat")
              ? "🐱"
              : formData.species
                    .toLowerCase()
                    .includes("rabbit")
                ? "🐰"
                : formData.species
                      .toLowerCase()
                      .includes("bird")
                  ? "🐦"
                  : "🐶"}
          </div>

          <p className="add-pet-preview-label">
            Listing preview
          </p>

          <h3>
            {formData.name || "Your pet's name"}
          </h3>

          <p>
            {formData.breed ||
              "Breed will appear here"}
          </p>

          <div className="add-pet-preview-details">
            <div>
              <span>Species</span>
              <strong>
                {formData.species || "Not entered"}
              </strong>
            </div>

            <div>
              <span>Age</span>
              <strong>
                {formData.age
                  ? `${formData.age} ${
                      Number(formData.age) === 1
                        ? "year"
                        : "years"
                    }`
                  : "Not entered"}
              </strong>
            </div>
          </div>
        </aside>

        <div className="page-card add-pet-form-card">
          <div className="form-card-heading">
            <div className="form-card-icon">🐾</div>

            <div>
              <h3>Pet information</h3>
              <p>
                Complete all fields before publishing the
                listing.
              </p>
            </div>
          </div>

          {message && (
            <div className="alert alert-success">
              {message}
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form
            className="form-grid"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="name">
                Pet name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="For example, Buddy"
                value={formData.name}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="species">
                  Species
                </label>

                <select
                  id="species"
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select species
                  </option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Rabbit">
                    Rabbit
                  </option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="age">
                  Age in years
                </label>

                <input
                  id="age"
                  type="number"
                  name="age"
                  placeholder="For example, 3"
                  value={formData.age}
                  onChange={handleChange}
                  min="0"
                  max="40"
                  step="1"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="breed">
                Breed
              </label>

              <input
                id="breed"
                type="text"
                name="breed"
                placeholder="For example, Golden Retriever"
                value={formData.breed}
                onChange={handleChange}
                autoComplete="off"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={onBack}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Saving Listing..."
                  : "Save Pet Listing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default AddPetPage;