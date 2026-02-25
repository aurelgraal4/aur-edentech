import React from "react"
import ReactDOM from "react-dom/client"
import Router from "./app/router"
import AppProvider from "./app/providers/AppProvider"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <Router />
    </AppProvider>
  </React.StrictMode>
)