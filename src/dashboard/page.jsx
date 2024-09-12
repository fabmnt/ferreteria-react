import { Redirect, useLocation } from 'wouter'
import { useSession } from '../hooks/useSession'
import { supabase } from '../db/supabase'

export function Dashboard () {
  const { session } = useSession()
  const [, setLocation] = useLocation()

  if (session == null) {
    return (
      <Redirect to='/login' />
    )
  }

  const handleClick = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error al cerrar sesión', error)
    }
    setLocation('/login')
  }
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleClick}>Cerrar sesión</button>
    </div>
  )
}
