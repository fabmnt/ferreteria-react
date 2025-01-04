import { useEffect, useState } from 'react'
import { supabase } from './../../db/supabase'

const useTrackSignIn = () => {
  const [lastSignIn, setLastSignIn] = useState(null)

  const updateLastSignIn = async (userId) => {
    try {
      const { error } = await supabase
        .from('employees')
        .update({ last_sign_in_at: new Date().toISOString() })
        .eq('user_id', userId)

      if (error) {
        console.error('Error al actualizar la última conexión:', error.message)
      }
    } catch (error) {
      console.error('Error al actualizar la última conexión:', error.message)
    }
  }

  const fetchLastSignIn = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('last_sign_in_at')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error al obtener la última conexión:', error.message)
      } else {
        setLastSignIn(data.last_sign_in_at)
      }
    } catch (error) {
      console.error('Error al obtener la última conexión:', error.message)
    }
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        updateLastSignIn(session.user.id)
        fetchLastSignIn(session.user.id)
      }
    })

    const unsubscriber = authListener.subscription.unsubscribe

    return () => {
      if (typeof unsubscriber === 'function') {
        unsubscriber()
      }
    }
  }, [])

  return lastSignIn
}

export default useTrackSignIn
