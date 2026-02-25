import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './app/layouts/ProtectedRoute'
import EventDebugger from './devtools/EventDebugger'

function App(): JSX.Element {
        return (
                <>
                        <BrowserRouter>
                                <Routes>
                                        <Route path="/" element={<Login />} />
                                        <Route
                                                path="/dashboard"
                                                element={
                                                        <ProtectedRoute>
                                                                <Dashboard />
                                                        </ProtectedRoute>
                                                }
                                        />
                                </Routes>
                        </BrowserRouter>

                        {import.meta.env.DEV && (
                                <div style={{ position: "fixed", right: 12, bottom: 12, width: 520, zIndex: 9999, boxShadow: "0 6px 18px rgba(0,0,0,0.12)", borderRadius: 8, background: "#fff" }}>
                                        <EventDebugger />
                                </div>
                        )}
                </>
        )
}

export default App