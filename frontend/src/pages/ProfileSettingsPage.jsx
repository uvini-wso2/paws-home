import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
} from "../services/profileService";

function ProfileSettingsPage({
  getAccessToken,
  onBack,
}) {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] =
    useState(false);
  const [savingProfile, setSavingProfile] =
    useState(false);
  const [profileError, setProfileError] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const [formData, setFormData] = useState({
    givenName: "",
    familyName: "",
    email: "",
    phone: "",
    address: "",
  });

  const getValueFromArray = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return "";
    }

    const primaryItem =
      items.find((item) => item?.primary) ?? items[0];

    return typeof primaryItem === "string"
      ? primaryItem
      : primaryItem?.value ?? "";
  };

  const loadProfile = async () => {
    setLoadingProfile(true);
    setProfileError("");
    setSuccessMessage("");

    try {
      const accessToken = await getAccessToken();
      const data = await getProfile(accessToken);

      setProfile(data);

      setFormData({
        givenName: data.name?.givenName ?? "",
        familyName: data.name?.familyName ?? "",
        email: getValueFromArray(data.emails),
        phone: getValueFromArray(data.phoneNumbers),
        address:
          data.addresses?.[0]?.formatted ??
          data.addresses?.[0]?.streetAddress ??
          "",
      });
    } catch (error) {
      console.error("Failed to load profile:", error);

      setProfileError(
        error instanceof Error
          ? error.message
          : "Unable to load profile."
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    setSavingProfile(true);
    setProfileError("");
    setSuccessMessage("");

    try {
      const accessToken = await getAccessToken();

      await updateProfile(accessToken, formData);

      setSuccessMessage(
        "Profile updated successfully."
      );

      const refreshedProfile = await getProfile(
        accessToken
      );

      setProfile(refreshedProfile);
    } catch (error) {
      console.error("Failed to update profile:", error);

      setProfileError(
        error instanceof Error
          ? error.message
          : "Unable to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const verificationStatus =
    profile?.verified ??
    profile?.emailVerified ??
    profile?.active ??
    false;
  
  const fullName = 
    `${formData.givenName || ""} ${
      formData.familyName || ""
    }`.trim();

  const displayName =
    fullName ||
    profile?.displayName ||
    profile?.userName ||
    "User";

  const initials =
    (formData.givenName?.charAt(0) || "") +
    (formData.familyName?.charAt(0) || "");

  const profileInitials =
    initials.length > 0
      ? initials.toUpperCase()
      : String(profile?.userName || "U")
        .charAt(0)
        .toUpperCase();
    
    useEffect(() => {
      loadProfile();
    }, []);

  return (
    <section>
      <div className="page-heading-row">
        <div>
          <p className="page-eyebrow">
            Account management
          </p>

          <h2 className="page-title">
            Profile Settings
          </h2>

          <p className="page-subtitle">
            View and update your personal account information.
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

      {loadingProfile && (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Loading profile...</p>
        </div>
      )}

      {profileError && (
        <div className="alert alert-error">
          {profileError}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {profile && !loadingProfile && (
        <div className="profile-settings-layout">
          <aside className="profile-summary-card">
            <div className="profile-avatar">
              {profileInitials}
            </div>

            <h3>{displayName}</h3>

            <p className="profile-summary-email">
              {formData.email || "No email available"}
            </p>

            <span
              className={`verification-badge ${
                verificationStatus
                  ? "verification-badge-active"
                  : "verification-badge-inactive"
              }`}
            >
              <span className="verification-dot" />

              {verificationStatus
                ? "Verified account"
                : "Not verified"}
            </span>

            <div className="profile-account-details">
              <div>
                <span>Username</span>
                <strong>
                  {profile.userName || "Not available"}
                </strong>
              </div>

              <div>
                <span>Phone number</span>
                <strong>
                  {formData.phone || "Not provided"}
                </strong>
              </div>
            </div>
          </aside>

          <form
            className="page-card profile-form-card"
            onSubmit={handleSave}
          >
            <div className="form-card-heading">
              <span className="form-card-icon">
                👤
              </span>

              <div>
                <h3>Personal Information</h3>
                <p>
                  Keep your account information accurate and
                  up to date.
                </p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="username">
                  Username
                </label>

                <input
                  id="username"
                  type="text"
                  value={profile.userName ?? ""}
                  disabled
                />

                <small className="form-help-text">
                  Your username is managed by Asgardeo and
                  cannot be changed here.
                </small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="givenName">
                    First name
                  </label>

                  <input
                    id="givenName"
                    type="text"
                    name="givenName"
                    value={formData.givenName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="familyName">
                    Last name
                  </label>

                  <input
                    id="familyName"
                    type="text"
                    name="familyName"
                    value={formData.familyName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Phone number
                </label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+94 77 123 4567"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">
                  Home address
                  <span className="optional-label">
                    Optional
                  </span>
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Enter your home address"
                />
              </div>

              <div className="profile-status-row">
                <div>
                  <span>Account status</span>
                  <strong>
                    {verificationStatus
                      ? "Verified and active"
                      : "Verification required"}
                  </strong>
                </div>

                <span
                  className={`status-indicator ${
                    verificationStatus
                      ? "status-indicator-active"
                      : "status-indicator-inactive"
                  }`}
                >
                  {verificationStatus
                    ? "Active"
                    : "Not verified"}
                </span>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={onBack}
                  disabled={savingProfile}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={savingProfile}
                >
                  {savingProfile
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default ProfileSettingsPage;