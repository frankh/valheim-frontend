import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import logo from "./valheim_transparent.png";
import "./App.css";

const baseUrl = "http://localhost:3001/api";

async function apiCall(url: string, callback: Dispatch<SetStateAction<any>>) {
  try {
    const response = await fetch(url, {
      method: "POST",
    });
    if (response.ok) {
      const text = await response.text();
      return callback(text)
    }
  } catch (e) {
    return callback("Failed")
  }
}

enum Status {
  FETCHING = "Fetching",
  FAILED = "Failed",
  RUNNING = "RUNNING"
}

const buttonText = {
  [Status.FETCHING]: "...",
  [Status.FAILED]: "Failed to get status",
  [Status.RUNNING]: "Server already running...",
}

function App() {
  const [status, updateStatus] = useState<Status>(Status.FETCHING);
  const [players, updatePlayerList] = useState<string>("Loading");
  const [playerCount, updatePlayerCount] = useState<string>("Loading");

  const updateStats = async () => {
    return Promise.all([
      apiCall(`${baseUrl}/status`, updateStatus),
      apiCall(`${baseUrl}/connected`, updatePlayerCount),
      apiCall(`${baseUrl}/recent`, updatePlayerList),
    ]);
  };

  useEffect(() => {
    updateStats();
  }, []);

  const DEFAULT_BUTTON_TEXT = "Start server";
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Valheim logo" />
        <button
          className="button"
          disabled={Object.values(Status).includes(status)}
          onClick={() => {
            updateStatus(Status.FETCHING);
            fetch(`${baseUrl}/start`, {
              method: "POST",
            })
              .then(() => {
                updateStats();
              })
              .catch(() => {
                updateStats();
              });
          }}
        >
          {buttonText[status] || DEFAULT_BUTTON_TEXT}
        </button>
        <p>Server status: {status}</p>
        <p>Players connected: {playerCount}</p>
        <p>Recently connected players: {players}</p>
      </header>
    </div>
  );
}

export default App;
