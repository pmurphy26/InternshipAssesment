import { useSupabaseAuth } from "./helpers/useSupabaseAuth";
import "./App.css";
import { BoardUI } from "./UIAssets/BoardUI";

function App() {
  const { session, loading } = useSupabaseAuth();

  console.log("loading");
  if (loading) {
    return <div className="loading-session">Initializing session…</div>;
  }

  if (!session) {
    return (
      <div className="loading-session">Failed to create guest session.</div>
    );
  }

  return (
    <div className="page-container">
      <div
        style={{ width: "10%", background: "#6A994E", boxSizing: "border-box" }}
      >
        <header className="page-header">
          <h1 className="header-title">Taskboard</h1>
          <span className="header-subtext">
            Guest ID: {session.user.id.slice(0, 8)}…
          </span>
        </header>
        <div style={{ color: "white" }}>Right click to select a task</div>
      </div>
      <BoardUI />
    </div>
  );
}

export default App;
