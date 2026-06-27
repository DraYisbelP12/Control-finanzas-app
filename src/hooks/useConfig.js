import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useConfig(clave) {
  const [valor, setValor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('configuracion').select('valor').eq('clave', clave).maybeSingle()
      .then(({ data }) => {
        setValor(data?.valor ?? null)
        setLoading(false)
      })
  }, [clave])

  async function update(nuevoValor) {
    const val = String(nuevoValor)
    const { error } = await supabase.from('configuracion')
      .upsert({ clave, valor: val }, { onConflict: 'clave' })
    if (!error) setValor(val)
    return { error }
  }

  return { valor, loading, update }
}
