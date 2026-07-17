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

    useEffect(() => {
        loadProfile();
    }, []);

  return (
    <section
      style={{
        marginTop: "30px",
        padding: "30px",
        backgroundColor: "white",
        borderRadius: "12px",
      }}
    >
      <h2>Profile Settings</h2>

      {loadingProfile && <p>Loading profile...</p>}

      {profileError && (
        <p style={{ color: "crimson" }}>
          {profileError}
        </p>
      )}

      {successMessage && (
        <p style={{ color: "green" }}>
          {successMessage}
        </p>
      )}

      {profile && !loadingProfile && (
        <form onSubmit={handleSave}>
          <label
            style={{
              display: "block",
              marginBottom: "16px",
            }}
          >
            Username — read-only

            <input
              type="text"
              value={profile.userName ?? ""}
              disabled
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            />
          </label>

          <label
            style={{
              display: "block",
              marginBottom: "16px",
            }}
          >
            First name

            <input
              type="text"
              name="givenName"
              value={formData.givenName}
              onChange={handleInputChange}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            />
          </label>

          <label
            style={{
              display: "block",
              marginBottom: "16px",
            }}
          >
            Last name

            <input
              type="text"
              name="familyName"
              value={formData.familyName}
              onChange={handleInputChange}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            />
          </label>

          <label
            style={{
              display: "block",
              marginBottom: "16px",
            }}
          >
            Email

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            />
          </label>

          <label
            style={{
              display: "block",
              marginBottom: "16px",
            }}
          >
            Phone number

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+94 77 123 4567"
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            />
          </label>

          <label
            style={{
              display: "block",
              marginBottom: "16px",
            }}
          >
            Home address — optional

            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            />
          </label>

          <p>
            <strong>Verification status:</strong>{" "}
            {verificationStatus
              ? "Verified / Active"
              : "Not verified"}
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            <button
              type="submit"
              disabled={savingProfile}
            >
              {savingProfile
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={onBack}
            >
              Back to Home
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default ProfileSettingsPage;