import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { usePerfil } from '../hooks/usePerfil'
import SideMenu from './SideMenu'
import { IconMoney, IconBank, IconList, IconChart, IconMenu } from './icons/NavIcons'

const tabs = [
  { to: '/movimientos', label: 'Movimientos', Icon: IconMoney },
  { to: '/cuentas',     label: 'Cuentas',     Icon: IconBank  },
  { to: '/deudas',      label: 'Deudas',      Icon: IconList  },
  { to: '/resumen',     label: 'Resumen',     Icon: IconChart },
]

export default function Layout({ children }) {
  const perfil = usePerfil()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Top bar */}
      <header role="banner" style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 'var(--topbar-h)',
        background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 var(--space-5)', zIndex: 100,
        boxShadow: '0 1px 0 rgba(255,255,255,0.08), 0 2px 10px rgba(0,0,0,0.14)',
      }}>
        <span style={{
          color: '#fff', fontWeight: 800,
          fontSize: 'var(--text-base)', letterSpacing: '-0.02em',
        }}>
          Finanzas
        </span>
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          aria-controls="side-menu"
          style={{
            background: 'rgba(255,255,255,0.14)',
            border: '1px solid rgba(255,255,255,0.22)',
            color: '#fff',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            width: '36px', height: '36px',
            transition: 'background var(--transition)',
          }}
        >
          <IconMenu size={20} />
        </button>
      </header>

      <main style={{
        flex: 1,
        paddingTop: 'var(--topbar-h)',
        paddingBottom: 'var(--bottomnav-h)',
      }}>
        {children}
      </main>

      {/* Bottom nav */}
      <nav
        role="navigation"
        aria-label="Navegacion principal"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          height: 'var(--bottomnav-h)',
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'stretch',
          zIndex: 100,
        }}
      >
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            style={{
              flex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none',
              paddingTop: '6px', paddingBottom: '4px',
              gap: '2px',
            }}
          >
            {({ isActive }) => (
              <>
                <span style={{
                  width: '52px', height: '28px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 'var(--radius-full)',
                  background: isActive ? 'var(--color-primary-light)' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  transition: 'background var(--transition), color var(--transition)',
                }}>
                  <Icon size={20} />
                </span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  letterSpacing: '0.01em',
                  transition: 'color var(--transition)',
                }}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {menuOpen && (
        <SideMenu
          id="side-menu"
          perfil={perfil}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </div>
  )
}
