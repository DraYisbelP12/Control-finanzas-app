import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { IconTag, IconBank } from './icons/NavIcons'

export default function SideMenu({ id, perfil, onClose }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    onClose()
  }

  function go(path) {
    navigate(path)
    onClose()
  }

  const isAdmin = perfil?.rol === 'administradora'

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(15,23,42,0.5)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      />

      {/* Panel */}
      <div
        id={id}
        role="dialog"
        aria-label="Menu lateral"
        aria-modal="true"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 301,
          width: '270px',
          background: 'var(--color-surface)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '-8px 0 32px rgb(0 0 0 / 0.14)',
        }}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
          padding: 'var(--space-8) var(--space-5) var(--space-5)',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 'var(--space-3)',
            color: '#fff',
            fontSize: 'var(--text-lg)', fontWeight: 800, letterSpacing: '-0.02em',
          }}>
            {(perfil?.nombre || 'U')[0].toUpperCase()}
          </div>
          <p style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: '#fff', marginBottom: 'var(--space-2)', letterSpacing: '-0.01em' }}>
            {perfil?.nombre || '-'}
          </p>
          <span className="ds-badge ds-badge-primary" style={{
            background: 'rgba(255,255,255,0.18)',
            color: 'rgba(255,255,255,0.92)',
            fontSize: 'var(--text-xs)',
            border: '1px solid rgba(255,255,255,0.22)',
            textTransform: 'capitalize',
          }}>
            {perfil?.rol}
          </span>
        </div>

        {/* Links */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-3) 0' }}>
          {isAdmin && (
            <>
              <p className="ds-section-label" style={{ padding: 'var(--space-3) var(--space-5) var(--space-1)' }}>
                Configuracion
              </p>
              <MenuItem icon={<IconTag size={18} />} label="Categorias" onClick={() => go('/config/categorias')} />
              <MenuItem icon={<IconBank size={18} />} label="Cuentas"    onClick={() => go('/cuentas')} />
            </>
          )}
        </div>

        {/* Logout */}
        <div style={{ padding: 'var(--space-4) var(--space-5)', borderTop: '1px solid var(--color-border)' }}>
          <button onClick={handleLogout} className="ds-btn ds-btn-danger" style={{ width: '100%' }}>
            Cerrar sesion
          </button>
        </div>
      </div>
    </>
  )
}

function MenuItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-3) var(--space-5)',
        background: 'none', border: 'none', cursor: 'pointer',
        fontSize: 'var(--text-base)', color: 'var(--color-text-primary)',
        textAlign: 'left',
        borderRadius: 0,
        transition: 'background var(--transition)',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--color-bg)'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      <span style={{ color: 'var(--color-primary)', flexShrink: 0 }}>{icon}</span>
      {label}
    </button>
  )
}
