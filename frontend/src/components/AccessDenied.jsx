function AccessDenied({ onBack }) {
  return (
    <section
      style={{
        maxWidth: "500px",
        margin: "60px auto",
        padding: "32px",
        textAlign: "center",
        border: "1px solid #ddd",
        borderRadius: "12px",
      }}
    >
      <h2>Access Denied</h2>

      <p>
        You do not have permission to access this page.
      </p>

      <button
        type="button"
        onClick={onBack}
      >
        Back to Home
      </button>
    </section>
  );
}

export default AccessDenied;