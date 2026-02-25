import { Link } from "react-router-dom"

export default function Navbar() {
  return (
      <header className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-black">

            <div className="text-gold font-bold text-lg">
                    EdenTech
                          </div>

                                <nav className="flex gap-6 text-sm">

                                        <Link to="/dashboard">Dashboard</Link>
                                                <Link to="/forum">Forum</Link>
                                                        <Link to="/viaggio">Viaggio</Link>
                                                                <Link to="/governance">Governance</Link>
                                                                        <Link to="/premi">Premi</Link>
                                                                                <Link to="/coin">Coin</Link>
                                                                                        <Link to="/wallet">Wallet</Link>
                                                                                                <Link to="/utenti">Utenti</Link>
                                                                                                        <Link to="/profilo">Profilo</Link>

                                                                                                              </nav>

                                                                                                                  </header>
                                                                                                                    )
                                                                                                                    }