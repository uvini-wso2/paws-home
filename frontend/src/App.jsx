import { useState } from "react";
import { useAsgardeo } from "@asgardeo/react";

import HomePage from "./pages/Home";
import BrowsePetsPage from "./pages/BrowsePetsPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import AddPetPage from "./pages/AddPetPage";
import ManageListingsPage from "./pages/ManageListingsPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

import "./App.css";

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
  
  const isAdmin =
    roles.includes("Admin") ||
    roles.includes("admin");

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

  if (!isSignedIn) {
    return (
      <div className="app-shell">
        <main className="app-main">
          <section
            className="page-card"
            style={{
              maxWidth: "520px",
              margin: "80px auto 0",
              textAlign: "center",
            }}
          >
            <div
              className="brand-icon"
              style={{
                margin: "0 auto 16px",
              }}
            >
              🐾
            </div>

            <h1 className="page-title">
              Paws & Homes
            </h1>

            <p className="page-subtitle">
              Helping pets find safe and loving homes.
            </p>

            {authError && (
              <div className="alert alert-error">
                {authError}
              </div>
            )}

            <button
              type="button"
              className="primary-button"
              onClick={handleSignIn}
              style={{
                marginTop: "24px",
              }}
            >
              Sign In with Asgardeo
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div
          className="brand"
          role="button"
          tabIndex={0}
          onClick={() => navigateToPage("home")}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              navigateToPage("home");
            }
          }}
          style={{ cursor: "pointer" }}
        >
          <div className="brand-icon">🐾</div>

          <div className="brand-text">
            <h1>Paws & Homes</h1>
            <p>Helping pets find loving families</p>
          </div>
        </div>

        <div className="header-actions">
          {roles.length > 0 && (
            <span className="role-badge">
              {roles.join(", ")}
            </span>
          )}

          <button
            type="button"
            className="secondary-button"
            onClick={handleSignOut}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="app-main">
        {authError && (
          <div className="alert alert-error">
            {authError}
          </div>
        )}

        {currentPage === "home" &&
          !showSettings && (
            <HomePage
              displayName={displayName}
              roles={roles}
              isAdopter={isAdopter}
              isShelterStaff={isShelterStaff}
              isAdmin={isAdmin}
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
              getAccessToken={getAccessToken}
              isAdopter={isAdopter}
            />
          )}

        {currentPage === "myApplications" &&
          !showSettings && (
            <MyApplicationsPage
              onBack={() => setCurrentPage("home")}
              getAccessToken={getAccessToken}
              isAdopter={isAdopter}
            />
          )}

        {currentPage === "addPet" &&
          !showSettings && (
            <AddPetPage
              onBack={() =>
                navigateToPage("home")
              }
              getAccessToken={getAccessToken}
              isShelterStaff={isShelterStaff}
            />
          )}

        {currentPage === "manageListings" &&
          !showSettings && (
            <ManageListingsPage
              onBack={() =>
                navigateToPage("home")
              }
              getAccessToken={getAccessToken}
              isShelterStaff={isShelterStaff}
            />
          )}

        {currentPage === "adminDashboard" &&
          !showSettings && (
            <AdminDashboardPage
              onBack={() =>
                navigateToPage("home")
              }
              getAccessToken={getAccessToken}
              isAdmin={isAdmin}
            />
          )}

        {showSettings && (
          <ProfileSettingsPage
            getAccessToken={getAccessToken}
            onBack={closeSettings}
          />
        )}
      </main>
    </div>
  );
}

export default App;