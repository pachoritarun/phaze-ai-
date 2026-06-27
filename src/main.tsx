import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import { Landing } from "./routes/index";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Landing />
  </React.StrictMode>
);
