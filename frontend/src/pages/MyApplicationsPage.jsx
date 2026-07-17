function MyApplicationsPage({ onBack }) {
  return (
    <section style={{ textAlign: "center" }}>
      <h2>My Adoption Applications</h2>
      <p>Your submitted applications will appear here.</p>

      <button type="button" onClick={onBack}>
        Back to Home
      </button>
    </section>
  );
}

export default MyApplicationsPage;