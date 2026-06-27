import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function fmt(n, moneda) {
  return Number(n).toLocaleString('es-DO', { minimumFractionDigits: 2 }) + ' ' + moneda
}

function mesLabel(year, month) {
  return new Date(year, month - 1, 1).toLocaleDateString('es-DO', { month: 'long', year: 'numeric' })
}

export default function Resumen() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [movimientos, setMovimientos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const desde = `${year}-${String(month).padStart(2, '0')}-01`
    const hasta = new Date(year, month, 0).toISOString().split('T')[0]
    supabase
      .from('movimientos')
      .select('tipo, monto, moneda, categoria_id, categorias(nombre)')
      .is('deleted_at', null)
      .gte('fecha', desde)
      .lte('fecha', hasta)
      .then(({ data }) => { setMovimientos(data || []); setLoading(false) })
  }, [year, month])

  function prevMes() {
    if (month === 1) { setYear(y => y - 1); setMonth(12) } else setMonth(m => m - 1)
  }
  function nextMes() {
    const n = new Date()
    if (year > n.getFullYear() || (year === n.getFullYear() && month >= n.getMonth() + 1)) return
    if (month === 12) { setYear(y => y + 1); setMonth(1) } else setMonth(m => m + 1)
  }

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth() + 1

  const totales = { ingresos: {}, gastos: {} }
  movimientos.forEach(m => {
    const bucket = m.tipo === 'ingreso' ? totales.ingresos : totales.gastos
    bucket[m.moneda] = (bucket[m.moneda] || 0) + Number(m.monto)
  })

  const monedas = [...new Set(movimientos.map(m => m.moneda))].sort()

  const porCategoria = {}
  movimientos.forEach(m => {
    const cat = m.categorias?.nombre || 'Sin categoría'
    if (!porCategoria[cat]) porCategoria[cat] = { ingreso: {}, gasto: {} }
    const bucket = porCategoria[cat][m.tipo]
    bucket[m.moneda] = (bucket[m.moneda] || 0) + Number(m.monto)
  })

  const gastosCat = Object.entries(porCategoria)
    .map(([nombre, v]) => ({ nombre, montos: v.gasto }))
    .filter(x => Object.keys(x.montos).length > 0)
    .sort((a, b) => {
      const sumA = Object.values(a.montos).reduce((s, n) => s + n, 0)
      const sumB = Object.values(b.montos).reduce((s, n) => s + n, 0)
      return sumB - sumA
    })

  const ingresosCat = Object.entries(porCategoria)
    .map(([nombre, v]) => ({ nombre, montos: v.ingreso }))
    .filter(x => Object.keys(x.montos).length > 0)
    .sort((a, b) => {
      const sumA = Object.values(a.montos).reduce((s, n) => s + n, 0)
      const sumB = Object.values(b.montos).reduce((s, n) => s + n, 0)
      return sumB - sumA
    })

  const hayDatos = movimientos.length > 0

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* Header con selector de mes */}
      <div style={{ background: '#2563eb', color: '#fff', padding: '1rem', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Resumen</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={prevMes} style={navBtnStyle}>‹</button>
          <span style={{ flex: 1, textAlign: 'center', fontWeight: 500, fontSize: '0.9rem', textTransform: 'capitalize' }}>
            {mesLabel(year, month)}
          </span>
          <button onClick={nextMes} style={{ ...navBtnStyle, opacity: isCurrentMonth ? 0.3 : 1 }} disabled={isCurrentMonth}>›</button>
        </div>
      </div>

      <div style={{ padding: '0.75rem' }}>
        {loading && <p style={{ textAlign: 'center', color: '#6b7280', padding: '3rem' }}>Cargando...</p>}

        {!loading && !hayDatos && (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: '4rem 1rem' }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</p>
            <p>Sin movimientos en {mesLabel(year, month)}.</p>
          </div>
        )}

        {!loading && hayDatos && (
          <>
            {/* Balance por moneda */}
            {monedas.map(mon => {
              const ing = totales.ingresos[mon] || 0
              const gas = totales.gastos[mon] || 0
              const bal = ing - gas
              return (
                <div key={mon} style={{ background: '#fff', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                    Balance {mon}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                    <Stat label="Ingresos" value={fmt(ing, mon)} color="#16a34a" />
                    <Stat label="Gastos" value={fmt(gas, mon)} color="#dc2626" />
                    <Stat label="Balance" value={fmt(bal, mon)} color={bal >= 0 ? '#2563eb' : '#dc2626'} bold />
                  </div>
                </div>
              )
            })}

            {/* Gastos por categoría */}
            {gastosCat.length > 0 && (
              <Section title="Gastos por categoría">
                {gastosCat.map(({ nombre, montos }) => (
                  <CatRow key={nombre} nombre={nombre} montos={montos} color="#dc2626" />
                ))}
              </Section>
            )}

            {/* Ingresos por categoría */}
            {ingresosCat.length > 0 && (
              <Section title="Ingresos por categoría">
                {ingresosCat.map(({ nombre, montos }) => (
                  <CatRow key={nombre} nombre={nombre} montos={montos} color="#16a34a" />
                ))}
              </Section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value, color, bold }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '0.2rem' }}>{label}</p>
      <p style={{ fontSize: '0.8rem', fontWeight: bold ? 700 : 600, color }}>{value}</p>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '1rem', marginBottom: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
      <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function CatRow({ nombre, montos, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ fontSize: '0.85rem', color: '#374151' }}>{nombre}</span>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1px' }}>
        {Object.entries(montos).map(([mon, val]) => (
          <span key={mon} style={{ fontSize: '0.85rem', fontWeight: 600, color }}>{fmt(val, mon)}</span>
        ))}
      </div>
    </div>
  )
}

const navBtnStyle = {
  background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
  width: '32px', height: '32px', borderRadius: '8px', fontSize: '1.2rem',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
}
