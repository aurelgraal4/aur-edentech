import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Login() {
  const [sequence, setSequence] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.rpc('verify_sequence', {
        sequence_input: sequence,
      })

      if (error) {
        setError('Errore di connessione: ' + error.message)
        return
      }

      if (data === true) {
        localStorage.setItem('auth', 'true')
        navigate('/dashboard')
      } else {
        setError('Sequenza non valida')
      }
    } catch (err) {
      setError('Errore di connessione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '80px auto', padding: 20 }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="sequence">Sequenza</label>
          <input
            id="sequence"
            name="sequence"
            value={sequence}
            onChange={(e) => setSequence(e.target.value)}
            placeholder="Inserisci la sequenza"
            style={{ width: '100%', padding: 8, marginTop: 6 }}
            required
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '8px 12px' }}>
          {loading ? 'Verifica...' : 'Accedi'}
        </button>
      </form>

      {error && (
        <div role="alert" style={{ marginTop: 12, color: 'crimson' }}>
          {error}
        </div>
      )}
    </div>
  )
}
