import { useState } from "react";
import { useAsgardeo } from "@asgardeo/react";

import HomePage from "./pages/Home";
import BrowsePetsPage from "./pages/BrowsePetsPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import AddPetPage from "./pages/AddPetPage";
import ManageListingsPage from "./pages/ManageListingsPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";

function App() {
  const {
    isSignedIn,
    user,
    signIn,
    signOut,
    getAccessToken,
  } = useAsgardeo();

  const [currentPage, setCurrentPage] = useState("home");
  const [showSettings, setShowSettings] = useState(false);
  const [authError, setAuthError] = useState("");

  console.log("SIGNED-IN USER:", user);

  /*
   * The roles value may be returned as:
   * "Adopter"
   *
   * or:
   * ["Adopter"]
   *
   * This converts both formats into an array.
   */
  const rawRoles = user?.roles ?? [];

  const roles = Array.isArray(rawRoles)
    ? rawRoles
    : String(rawRoles)
        .split(",")
        .map((roleName) => roleName.trim())
        .filter(Boolean);

  const isAdopter = roles.includes("Adopter");

  const isShelterStaff =
    roles.includes("Shelter Staff") ||
    roles.includes("shelter-staff");

  const displayName =
    user?.displayName ||
    user?.givenName ||
    user?.userName ||
    user?.username ||
    "User";

  const handleSignIn = async () => {
    try {
      setAuthError("");
      await signIn();
    } catch (error) {
      console.error("Sign-in failed:", error);

      setAuthError(
        error instanceof Error
          ? error.message
          : "Sign-in failed."
      );
    }
  };

  const handleSignOut = async () => {
    try {
      setAuthError("");
      setCurrentPage("home");
      setShowSettings(false);

      await signOut();
    } catch (error) {
      console.error("Sign-out failed:", error);

      setAuthError(
        error instanceof Error
          ? error.message
          : "Sign-out failed."
      );
    }
  };

  const navigateToPage = (pageName) => {
    setShowSettings(false);
    setCurrentPage(pageName);
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
    setCurrentPage("home");
  };

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

        {authError && (
          <p
            style={{
              color: "crimson",
              textAlign: "center",
            }}
          >
            {authError}
          </p>
        )}

        {isSignedIn ? (
          <>
            {currentPage === "home" &&
              !showSettings && (
                <HomePage
                  displayName={displayName}
                  roles={roles}
                  isAdopter={isAdopter}
                  isShelterStaff={isShelterStaff}
                  onNavigate={navigateToPage}
                  onOpenSettings={openSettings}
                />
              )}

            {currentPage === "browsePets" &&
              !showSettings && (
                <BrowsePetsPage
                  onBack={() =>
                    navigateToPage("home")
                  }
                />
              )}

            {currentPage === "myApplications" &&
              !showSettings && (
                <MyApplicationsPage
                  onBack={() =>
                    navigateToPage("home")
                  }
                />
              )}

            {currentPage === "addPet" &&
              !showSettings && (
                <AddPetPage
                  onBack={() =>
                    navigateToPage("home")
                  }
                />
              )}

            {currentPage === "manageListings" &&
              !showSettings && (
                <ManageListingsPage
                  onBack={() =>
                    navigateToPage("home")
                  }
                />
              )}

            {showSettings && (
              <ProfileSettingsPage
                getAccessToken={getAccessToken}
                onBack={closeSettings}
              />
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