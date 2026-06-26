import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/movimientos', label: 'Movimientos', icon: '💸' },
  { to: '/cuentas', label: 'Cuentas', icon: '🏦' },
  { to: '/deudas', label: 'Deudas', icon: '📋' },
  { to: '/resumen', label: 'Resumen', icon: '📊' },
]

export default function Layout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f5f5f5' }}>
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '64px' }}>
        {children}
      </main>
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: '64px', background: '#fff',
        borderTop: '1px solid #e5e7eb',
        display: 'flex', alignItems: 'stretch',
        zIndex: 100,
      }}>
        {tabs.map(tab => (
          <NavLink key={tab.to} to={tab.to} style={({ isActive }) => ({
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '2px',
            textDecoration: 'none', fontSize: '0.65rem', fontWeight: 500,
            color: isActive ? '#2563eb' : '#6b7280',
            borderTop: isActive ? '2px solid #2563eb' : '2px solid transparent',
            transition: 'color 0.15s',
          })}>
            <span style={{ fontSize: '1.25rem' }}>{tab.icon}</span>
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
