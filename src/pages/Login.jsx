import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('login') // 'login' | 'recovery'

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  async function handleRecovery(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://drayisbelp12.github.io/Control-finanzas-app/',
    })
    if (error) setError(error.message)
    else setMessage('Revisa tu correo para restablecer tu contrasena.')
    setLoading(false)
  }

  const cardStyle = {
    background: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    width: '320px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  }
  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  }
  const labelStyle = { display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }
  const btnStyle = {
    width: '100%',
    padding: '0.625rem',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '0.75rem',
  }
  const linkStyle = {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    cursor: 'pointer',
    fontSize: '0.875rem',
    textDecoration: 'underline',
    padding: 0,
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <form onSubmit={mode === 'login' ? handleLogin : handleRecovery} style={cardStyle}>
        <h1 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Control de Finanzas</h1>

        {error && <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}
        {message && <p style={{ color: 'green', marginBottom: '1rem', fontSize: '0.875rem' }}>{message}</p>}

        <label style={labelStyle}>Correo</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />

        {mode === 'login' && (
          <>
            <label style={labelStyle}>Contrasena</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
          </>
        )}

        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? 'Procesando...' : mode === 'login' ? 'Entrar' : 'Enviar correo de recuperacion'}
        </button>

        {mode === 'login' ? (
          <button type="button" onClick={() => { setMode('recovery'); setError(null) }} style={linkStyle}>
            Olvide mi contrasena
          </button>
        ) : (
          <button type="button" onClick={() => { setMode('login'); setError(null); setMessage(null) }} style={linkStyle}>
            Volver al inicio de sesion
          </button>
        )}
      </form>
    </div>
  )
}