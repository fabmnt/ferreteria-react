import { useEffect } from 'react'
import { Route, Switch, useLocation } from 'wouter'
import './App.css'
import { Login } from './auth/login'
import { Register } from './auth/register'
import { Dashboard } from './dashboard/page'
import { useSessionStore } from './hooks/useSession'
import { DashboardLayout } from './layouts/dashboard'
import { supabase } from './db/supabase'

const App = () => {
  const setSession = useSessionStore((state) => state.setSession)
  const [, navigate] = useLocation()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session == null) {
        navigate('/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <Switch>
      <Route
        path='/login'
        component={Login}
      />
      <Route
        path='/register'
        component={Register}
      />
      <DashboardLayout>
        <Route
          path='/'
          component={Dashboard}
        />
      </DashboardLayout>
    </Switch>
  )
}

export default App
