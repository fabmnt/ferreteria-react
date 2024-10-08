import { useEffect } from 'react'
import { Route, Switch, useLocation, Redirect } from 'wouter'
import './App.css'
import { Login } from './auth/pages/login'
import { Register } from './auth/pages/register'
import { CreateBill } from './bills/pages/CreateBill'
import { Dashboard } from './dashboard/page'
import { supabase } from './db/supabase'
import { DashboardLayout } from './layouts/dashboard'
import { useSessionStore } from './store/session'
import { UsersPage } from './users/pages/users'
import { ProductsPage } from './products/pages/products'
import { ProductInfo } from './products/pages/product-info'

const App = () => {
  const setSession = useSessionStore((state) => state.setSession)
  const [location, navigate] = useLocation()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      const validRoutes = ['/register', '/login']
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
        <Route path='/'>
          <Redirect to='/home' />
        </Route>
        <Route
          path='/home'
          component={Dashboard}
        />
        <Route
          path='/users'
          component={UsersPage}
        />
        <Route
          path='/products'
          component={ProductsPage}
        />
        <Route
          path='/products/:id'
          component={ProductInfo}
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
