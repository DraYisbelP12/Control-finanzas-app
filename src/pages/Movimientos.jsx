import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { usePerfil } from '../hooks/usePerfil'
import MovimientoForm from '../components/MovimientoForm'

export default function Movimientos() {
  const perfil = usePerfil()
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)

  async function fetchMovimientos() {
    setLoading(true)
    const { data } = await supabase
      .from('movimientos')
      .select('*, categorias(nombre)')
      .is('deleted_at', null)
      .order('fecha', { ascending: false })
      .limit(100)
    setMovimientos(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchMovimientos() }, [])

  function handleNew() { setEditItem(null); setShowForm(true) }
  function handleEdit(m) { setEditItem(m); setShowForm(true) }
  function handleClose() { setShowForm(false); setEditItem(null) }
  async function handleSave() { await fetchMovimientos(); handleClose() }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este movimiento?')) return
    await supabase.from('movimientos').update({
      deleted_at: new Date().toISOString(),
      deleted_by: perfil?.id,
    }).eq('id', id)
    await fetchMovimientos()
  }

  const grouped = movimientos.reduce((acc, m) => {
    const key = m.fecha
    if (!acc[key]) acc[key] = []
    acc[key].push(m)
    return acc
  }, {})

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ background: '#2563eb', color: '#fff', padding: '1rem 1rem 1.25rem', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Movimientos</h1>
          <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>{perfil?.nombre}</span>
        </div>
      </div>

      {/* Lista */}
      <div style={{ padding: '0.75rem' }}>
        {loading && <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>Cargando...</p>}
        {!loading && movimientos.length === 0 && (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: '3rem 1rem' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💸</p>
            <p>No hay movimientos registrados.</p>
            <p style={{ fontSize: '0.875rem' }}>Toca + para agregar el primero.</p>
          </div>
        )}
        {Object.entries(grouped).map(([fecha, items]) => (
          <div key={fecha} style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, marginBottom: '0.4rem', paddingLeft: '0.25rem' }}>
              {new Date(fecha + 'T12:00:00').toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            {items.map(m => (
              <div key={m.id} onClick={() => handleEdit(m)} style={{
                background: '#fff', borderRadius: '10px', padding: '0.75rem 1rem',
                marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.15rem' }}>
                    {m.concepto || m.categorias?.nombre || '—'}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {m.categorias?.nombre}{m.subcategoria ? ` · ${m.subcategoria}` : ''}
                    {m.recurrente ? ' · 🔁' : ''}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 600, color: m.tipo === 'ingreso' ? '#16a34a' : '#dc2626', fontSize: '0.95rem' }}>
                    {m.tipo === 'ingreso' ? '+' : '-'}{Number(m.monto).toLocaleString('es-DO', { minimumFractionDigits: 2 })} {m.moneda}
                  </p>
                  {perfil?.rol === 'administradora' && (
                    <button onClick={e => { e.stopPropagation(); handleDelete(m.id) }}
                      style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.75rem', padding: '0.25rem 0' }}>
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* FAB */}
      <button onClick={handleNew} style={{
        position: 'fixed', bottom: '76px', right: '1.25rem',
        width: '52px', height: '52px', borderRadius: '50%',
        background: '#2563eb', color: '#fff', border: 'none',
        fontSize: '1.5rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50,
      }}>+</button>

      {/* Form Modal */}
      {showForm && (
        <MovimientoForm
          item={editItem}
          perfil={perfil}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
