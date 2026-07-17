function ManageListingsPage({ onBack }) {
  return (
    <section style={{ textAlign: "center" }}>
      <h2>Manage My Listings</h2>
      <p>Your shelter listings will appear here.</p>

      <button type="button" onClick={onBack}>
        Back to Home
      </button>
    </section>
  );
}

export default ManageListingsPage;