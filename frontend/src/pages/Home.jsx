function Home({
  displayName,
  roles,
  isAdopter,
  isShelterStaff,
  onNavigate,
  onOpenSettings,
}) {
  return (
    <section style={{ textAlign: "center" }}>
      <h2>Welcome, {displayName}!</h2>

      <p>
        You are successfully signed in through WSO2
        Identity Platform.
      </p>

      <p>
        <strong>Role:</strong>{" "}
        {roles.length > 0
          ? roles.join(", ")
          : "No role assigned"}
      </p>

      {isAdopter && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            margin: "20px 0",
          }}
        >
          <button
            type="button"
            onClick={() => onNavigate("browsePets")}
          >
            Browse Pets for Adoption
          </button>

          <button
            type="button"
            onClick={() => onNavigate("myApplications")}
          >
            View My Adoption Applications
          </button>
        </div>
      )}

      {isShelterStaff && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            margin: "20px 0",
          }}
        >
          <button
            type="button"
            onClick={() => onNavigate("addPet")}
          >
            Add New Pet
          </button>

          <button
            type="button"
            onClick={() => onNavigate("manageListings")}
          >
            Manage My Listings
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onOpenSettings}
      >
        Profile Settings
      </button>
    </section>
  );
}

export default Home;