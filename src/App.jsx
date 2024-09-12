import { Route, Switch } from 'wouter'
import './App.css'
import { Login } from './auth/login'
import { Register } from './auth/register'
import { Dashboard } from './dashboard/page'
import { DashboardLayout } from './layouts/dashboard'

const App = () => {
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
