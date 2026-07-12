import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("Checking backend...");

  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then((response) => response.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("Backend Offline"));
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "Arial",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1>🩺 MedGuide AI</h1>
        <h2>Backend Status</h2>
        <p>{status}</p>
      </div>
    </div>
  );
}

export default App;