import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import Premi from "../pages/Premi"

import AppLayout from "./layouts/AppLayout"
import ProtectedRoute from "../../router/ProtectedRoute"

import Forum from "../features/Forum"
import Journey from "../features/Journey"
import Governance from "../features/Governance"
import Wallet from "../features/Wallet"
import Totalita from "../pages/Totalita"
import Leaderboard from "../pages/Leaderboard"
import Profile from "../pages/Profile"
import ProfilePage from "../features/profile/ProfilePage"

export default function Router(): JSX.Element {
        return (
                <BrowserRouter>
                        <Routes>
                                {/* LOGIN */}
                                <Route path="/login" element={<Login />} />

                                {/* AREA PROTETTA */}
                                <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                                        <Route path="/dashboard" element={<Dashboard />} />
                                        <Route path="/app" element={<Navigate to="/dashboard" replace />} />
                                        <Route path="/totalita" element={<Totalita />} />
                                        <Route path="/forum" element={<Forum />} />
                                        <Route path="/journey" element={<Journey />} />
                                        <Route path="/governance" element={<Governance />} />
                                        <Route path="/premi" element={<Premi />} />
                                        <Route path="/wallet" element={<Wallet />} />
                                        <Route path="/leaderboard" element={<Leaderboard />} />
                                        <Route path="/profile" element={<Profile />} />
                                        <Route path="/profilo" element={<ProfilePage />} />
                                        <Route path="/profilo/:sequence_hash" element={<ProfilePage />} />
                                </Route>

                                {/* fallback */}
                                <Route path="*" element={<Navigate to="/login" />} />
                        </Routes>
                </BrowserRouter>
        )
}