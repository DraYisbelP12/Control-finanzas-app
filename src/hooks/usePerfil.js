import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function usePerfil() {
  const [perfil, setPerfil] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      supabase
        .from('perfiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
        .then(({ data: p }) => setPerfil(p))
    })
  }, [])

  return perfil
}
