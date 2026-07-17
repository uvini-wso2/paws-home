function AddPetPage({ onBack }) {
  return (
    <section style={{ textAlign: "center" }}>
      <h2>Add New Pet</h2>
      <p>The pet creation form will appear here.</p>

      <button type="button" onClick={onBack}>
        Back to Home
      </button>
    </section>
  );
}

export default AddPetPage;