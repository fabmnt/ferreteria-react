import { useLocation } from 'wouter'
import { supabase } from '../db/supabase'

export function Dashboard() {
  const [, setLocation] = useLocation()

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
