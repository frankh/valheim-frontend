import React, { useEffect, useState } from "react";
import logo from "./valheim_transparent.png";
import "./App.css";

const baseUrl = "http://localhost:3001/api";

function apiCall(url, callback) {
  return fetch(url, {
    method: "POST",
  })
    .then((resp) => {
      if (resp.ok) {
        return resp.text();
      }
    })
    .then((resp) => {
      callback(resp);
    })
    .catch(() => {
      callback("Failed");
    });
}

function App() {
  const [status, updateStatus] = useState("Fetching");
  const [players, updatePlayerList] = useState("Loading");
  const [playerCount, updatePlayerCount] = useState("Loading");
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
  let buttonText;
  switch (status) {
    case "Fetching":
      buttonText = "...";
      break;
    case "Failed":
      buttonText = "Failed to get status";
      break;
    case "RUNNING":
      buttonText = "Server already running...";
      break;
    default:
      buttonText = "Start server";
      break;
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Valheim logo" />
        <button
          className="button"
          disabled={
            status === "RUNNING" || status === "Failed" || status === "Fetching"
          }
          onClick={() => {
            updateStatus("Fetching");
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
          {buttonText}
        </button>
        <p>Server status: {status}</p>
        <p>Players connected: {playerCount}</p>
        <p>Recently connected players: {players}</p>
      </header>
    </div>
  );
}

export default App;
