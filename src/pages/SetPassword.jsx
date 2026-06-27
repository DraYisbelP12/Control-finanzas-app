import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { IconEye, IconEyeOff, IconWallet } from '../components/icons/NavIcons'

export default function SetPassword({ mode, onDone }) {
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Esperar a que Supabase procese el token del hash automáticamente
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
    // Si ya hay sesión activa (token ya procesado antes del subscribe)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.history.replaceState(null, '', window.location.pathname)
      onDone()
    }
  }

  const isInvite = mode === 'invite'

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',
      background: 'linear-gradient(160deg, #3D7A59 0%, #4E8C69 55%, #6FAE8A 100%)',
    }}>
      {/* Hero */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(52px, 13vh, 88px) var(--space-6) clamp(36px, 9vh, 60px)',
        flex: '0 0 auto',
      }}>
        <div style={{
          width: 72, height: 72,
          borderRadius: '22px',
          background: 'rgba(255,255,255,0.18)',
          border: '1.5px solid rgba(255,255,255,0.30)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
          marginBottom: 'var(--space-5)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}>
          <IconWallet size={36} />
        </div>
        <h1 style={{
          fontSize: 'clamp(1.6rem, 6vw, 2.1rem)',
          fontWeight: 800, color: '#fff',
          letterSpacing: '-0.03em', marginBottom: '6px', lineHeight: 1.1,
        }}>
          Finanzas
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.65)', fontWeight: 400 }}>
          {isInvite ? 'Configuración de cuenta' : 'Restablecer contraseña'}
        </p>
      </div>

      {/* Form */}
      <div style={{
        flex: 1,
        background: 'var(--color-surface)',
        borderRadius: '28px 28px 0 0',
        padding: 'var(--space-8) var(--space-6) var(--space-10)',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.10)',
        minHeight: '56vh',
      }}>
        <h2 style={{
          fontSize: 'var(--text-xl)', fontWeight: 700,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.02em', marginBottom: 'var(--space-2)',
        }}>
          {isInvite ? 'Bienvenida' : 'Nueva contraseña'}
        </h2>
        <p style={{
          fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
          marginBottom: 'var(--space-6)', lineHeight: 1.5,
        }}>
          {isInvite
            ? 'Crea tu contraseña para acceder a tu espacio financiero.'
            : 'Ingresa la nueva contraseña para tu cuenta.'}
        </p>

        {!ready ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
            <div className="ds-skeleton" style={{ height: 12, width: '60%', margin: '0 auto var(--space-4)' }} />
            <div className="ds-skeleton" style={{ height: 12, width: '40%', margin: '0 auto' }} />
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
              Verificando enlace…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div role="alert" style={{
                background: 'var(--color-danger-light)',
                color: 'var(--color-danger)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-3) var(--space-4)',
                fontSize: 'var(--text-sm)',
                marginBottom: 'var(--space-5)',
                lineHeight: 1.5,
              }}>
                {error}
              </div>
            )}

            <div className="ds-field">
              <label htmlFor="new-password" className="ds-label">Nueva contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="new-password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  className="ds-input"
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  aria-label={showPwd ? 'Ocultar' : 'Mostrar'}
                  style={{
                    position: 'absolute', right: 0, top: 0,
                    width: '44px', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {showPwd ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
            </div>

            <div className="ds-field">
              <label htmlFor="confirm-password" className="ds-label">Confirmar contraseña</label>
              <input
                id="confirm-password"
                type={showPwd ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Repite la contraseña"
                className="ds-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="ds-btn ds-btn-primary"
              style={{ width: '100%', marginTop: 'var(--space-2)' }}
            >
              {loading ? 'Guardando…' : isInvite ? 'Crear contraseña y entrar' : 'Guardar nueva contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
