import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function Login() {
  const [sequence, setSequence] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
      const navigate = useNavigate();

        const handleLogin = async () => {
            setErrorMsg("");

                const { data, error } = await supabase.rpc(
                      "verify_sequence",
                            { input_code: sequence }
                                );

                                    console.log("DATA:", data);
                                        console.log("ERROR:", error);

                                            if (error || !data) {
                                                  setErrorMsg("Sequenza non valida");
                                                        return;
                                                            }

                                                                localStorage.setItem("auth", "true");
                                                                    navigate("/dashboard");
                                                                      };

                                                                        return (
                                                                            <div style={{ padding: 40 }}>
                                                                                  <h1>Accesso con Sequenza</h1>

                                                                                        <input
                                                                                                type="text"
                                                                                                        value={sequence}
                                                                                                                onChange={(e) => setSequence(e.target.value)}
                                                                                                                        placeholder="Inserisci sequenza"
                                                                                                                              />

                                                                                                                                    <button onClick={handleLogin}>
                                                                                                                                            Accedi
                                                                                                                                                  </button>

                                                                                                                                                        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
                                                                                                                                                            </div>
                                                                                                                                                              );
                                                                                                                                                              }