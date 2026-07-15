import { useAsgardeo } from "@asgardeo/react";

function App() {
  const { isSignedIn, user, signIn, signOut } = useAsgardeo();

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

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "16px",
      }}
    >
      <h1> 🐾 Paws and Homes </h1>
      {isSignedIn ? (
        <>
        <h2>Welcome, {user?.userName || user?.username || "User"}!</h2>
        <button type="button" onClick={handleSignOut}>
          Sign Out
        </button>
        </>
      ) : (
        <>
          <p>Please sign in to continue.</p>
          <button type="button" onClick={handleSignIn}>
            Sign In with Asgardeo
          </button>
        </>
      )}
    </main>
  );
}

export default App;