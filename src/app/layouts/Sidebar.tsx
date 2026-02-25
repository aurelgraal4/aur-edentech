import { Link } from "react-router-dom"

export default function Sidebar() {
  return (
      <aside className="w-64 border-r border-neutral-800 p-6 bg-black">

            <div className="text-xl font-bold mb-10 text-gold">
                    AUR
                          </div>

                                <nav className="flex flex-col gap-4 text-sm">

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

                                                                                                                  </aside>
                                                                                                                    )
                                                                                                                    }