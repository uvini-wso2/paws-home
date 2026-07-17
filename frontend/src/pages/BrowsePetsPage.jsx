function BrowsePetsPage({ onBack }) {
  return (
    <section style={{ textAlign: "center" }}>
      <h2>Browse Pets for Adoption</h2>
      <p>Available pets will be displayed here.</p>

      <button type="button" onClick={onBack}>
        Back to Home
      </button>
    </section>
  );
}

export default BrowsePetsPage;