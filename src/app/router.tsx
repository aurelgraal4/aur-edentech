import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import Premi from "../pages/Premi"

import ProtectedRoute from "../components/ProtectedRoute"

import AppLayout from "./layouts/AppLayout"
import AuthLayout from "./layouts/AuthLayout"

export default function Router() {
  return (
      <BrowserRouter>

            <Routes>

                    <Route
                              path="/login"
                                        element={
                                                    <AuthLayout>
                                                                  <Login />
                                                                              </AuthLayout>
                                                                                        }
                                                                                                />

                                                                                                        <Route
                                                                                                                  path="/dashboard"
                                                                                                                            element={
                                                                                                                                        <ProtectedRoute>
                                                                                                                                                      <AppLayout>
                                                                                                                                                                      <Dashboard />
                                                                                                                                                                                    </AppLayout>
                                                                                                                                                                                                </ProtectedRoute>
                                                                                                                                                                                                          }
                                                                                                                                                                                                                  />

                                                                                                                                                                                                                          <Route
                                                                                                                                                                                                                                    path="/premi"
                                                                                                                                                                                                                                              element={
                                                                                                                                                                                                                                                          <ProtectedRoute>
                                                                                                                                                                                                                                                                        <AppLayout>
                                                                                                                                                                                                                                                                                        <Premi />
                                                                                                                                                                                                                                                                                                      </AppLayout>
                                                                                                                                                                                                                                                                                                                  </ProtectedRoute>
                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                    />

                                                                                                                                                                                                                                                                                                                                            <Route path="*" element={<Navigate to="/login" />} />

                                                                                                                                                                                                                                                                                                                                                  </Routes>

                                                                                                                                                                                                                                                                                                                                                      </BrowserRouter>
                                                                                                                                                                                                                                                                                                                                                        )
                                                                                                                                                                                                                                                                                                                                                        }