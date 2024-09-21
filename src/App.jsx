import { useEffect } from 'react'
import { Route, Switch, useLocation } from 'wouter'
import './App.css'
import { Login } from './auth/pages/login'
import { Register } from './auth/pages/register'
import { Dashboard } from './dashboard/page'
import { supabase } from './db/supabase'
import { useSessionStore } from './store/session'
import { DashboardLayout } from './layouts/dashboard'
import { UsersPage } from './users/pages/users'
import { CreateBill } from './bills/pages/CreateBill'

const App = () => {
  const setSession = useSessionStore((state) => state.setSession)
  const [location, navigate] = useLocation()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      const validRoutes = ['/register']
      if (session == null && !validRoutes.includes(location)) {
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
        <Route
          path='/users'
          component={UsersPage}
        />
        <Route
          path='/bills/create'
          component={CreateBill}
        />
      </DashboardLayout>
    </Switch>
  )
}

export default App
