import { supabase } from '../lib/supabase'

export default function Dashboard() {
  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}>Dashboard</h1>
        <button onClick={handleLogout}
          style={{ padding: '0.5rem 1rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Cerrar sesion
        </button>
      </div>
      <p>Bienvenida. El sistema esta en construccion.</p>
    </div>
  )
}