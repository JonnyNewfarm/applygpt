import AuthStatus from "../components/AuthStatus";

export default function Page() {
  return (
    <main style={{ padding: 20 }}>
      <h1>ApplyGPT Home</h1>
      <AuthStatus />
    </main>
  );
}
