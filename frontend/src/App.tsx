import React from "react";
import IssuesList from "./components/IssuesList";

export default function App() {
  return (
    <div className="app-shell">
      <header className="header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1>Issue Tracker App</h1>
            <p>
              Lightweight issue tracker app - search, filter, sort, create, edit
              and delete issues.
            </p>
          </div>
        </div>
      </header>

      <main style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="content-card">
          <IssuesList />
        </div>
      </main>

      <footer className="footer">
        Made by <strong>Pranav Pardeshi</strong>
      </footer>
    </div>
  );
}
