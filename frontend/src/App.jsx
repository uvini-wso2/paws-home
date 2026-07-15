import { useState } from "react";
import { useAsgardeo } from "@asgardeo/react";

const PROFILE_URL =
  "https://api.asgardeo.io/t/uvinidev/scim2/Me";

function App() {
  const {
    isSignedIn,
    user,
    signIn,
    signOut,
    getAccessToken,
  } = useAsgardeo();

  const [showSettings, setShowSettings] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    givenName: "",
    familyName: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error("Sign-in failed:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };

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

      const response = await fetch(PROFILE_URL, {
        method: "GET",
        headers: {
          Accept: "application/scim+json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Could not load profile. Status: ${response.status}`
        );
      }

      const data = await response.json();

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

  const openSettings = async () => {
    setShowSettings(true);
    await loadProfile();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    setSavingProfile(true);
    setProfileError("");
    setSuccessMessage("");

    try {
      const accessToken = await getAccessToken();

      const patchBody = {
        schemas: [
          "urn:ietf:params:scim:api:messages:2.0:PatchOp",
        ],
        Operations: [
          {
            op: "replace",
            path: "name",
            value: {
              givenName: formData.givenName,
              familyName: formData.familyName,
            },
          },
          {
            op: "replace",
            path: "emails",
            value: [
              {
                value: formData.email,
                type: "work",
                primary: true,
              },
            ],
          },
          {
            op: "replace",
            path: "phoneNumbers",
            value: [
              {
                value: formData.phone,
                type: "mobile",
                primary: true,
              },
            ],
          },
          {
            op: "replace",
            path: "addresses",
            value: [
              {
                formatted: formData.address,
                type: "home",
                primary: true,
              },
            ],
          },
        ],
      };

      const response = await fetch(PROFILE_URL, {
        method: "PATCH",
        headers: {
          Accept: "application/scim+json",
          "Content-Type": "application/scim+json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(patchBody),
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          `Could not update profile. Status: ${
            response.status
          }. ${errorText}`
        );
      }

      setSuccessMessage("Profile updated successfully.");
      await loadProfile();
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

  const displayName =
    user?.displayName ||
    user?.givenName ||
    user?.userName ||
    user?.username ||
    "User";

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        backgroundColor: "#f5f5f5",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ textAlign: "center" }}>
          🐾 Paws and Homes
        </h1>

        {isSignedIn ? (
          <>
            {!showSettings ? (
              <section style={{ textAlign: "center" }}>
                <h2>Welcome, {displayName}!</h2>

                <p>
                  You are successfully signed in through
                  WSO2 Identity Platform.
                </p>

                <button
                  type="button"
                  onClick={openSettings}
                >
                  Profile Settings
                </button>
              </section>
            ) : (
              <section
                style={{
                  marginTop: "30px",
                  padding: "30px",
                  backgroundColor: "white",
                  borderRadius: "12px",
                }}
              >
                <h2>Profile Settings</h2>

                {loadingProfile && (
                  <p>Loading profile...</p>
                )}

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
                  <form onSubmit={saveProfile}>
                    <label
                      style={{ display: "block", marginBottom: "16px" }}
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
                        }}
                      />
                    </label>

                    <label
                      style={{ display: "block", marginBottom: "16px" }}
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
                        }}
                      />
                    </label>

                    <label
                      style={{ display: "block", marginBottom: "16px" }}
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
                        }}
                      />
                    </label>

                    <label
                      style={{ display: "block", marginBottom: "16px" }}
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
                        }}
                      />
                    </label>

                    <label
                      style={{ display: "block", marginBottom: "16px" }}
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
                        }}
                      />
                    </label>

                    <label
                      style={{ display: "block", marginBottom: "16px" }}
                    >
                      Home address — optional
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "10px",
                          marginTop: "6px",
                        }}
                      />
                    </label>

                    <p>
                      <strong>Verification status:</strong>{" "}
                      {profile.verified ??
                      profile.emailVerified ??
                      profile.active
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
                        onClick={() =>
                          setShowSettings(false)
                        }
                      >
                        Back to Home
                      </button>
                    </div>
                  </form>
                )}
              </section>
            )}

            <div
              style={{
                textAlign: "center",
                marginTop: "24px",
              }}
            >
              <button
                type="button"
                onClick={handleSignOut}
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <section style={{ textAlign: "center" }}>
            <p>Please sign in to continue.</p>

            <button
              type="button"
              onClick={handleSignIn}
            >
              Sign In with Asgardeo
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

export default App;