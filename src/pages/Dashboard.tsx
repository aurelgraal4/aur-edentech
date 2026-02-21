import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('auth')
    navigate('/')
  }

  return (
    <div style={{ maxWidth: 800, margin: '60px auto', padding: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '8px 12px' }}>
          Logout
        </button>
      </header>

      <main style={{ marginTop: 24 }}>
        <p>Benvenuto nella dashboard protetta.</p>
      </main>
    </div>
  )
}
