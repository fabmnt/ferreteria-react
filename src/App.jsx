import { Route, Switch } from 'wouter'
import './App.css'
import { Login } from './auth/login'
import { Register } from './auth/register'
import { Dashboard } from './dashboard/page'

const App = () => {
  return (
    <Switch>
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
      <Route path='/' component={Dashboard} />
    </Switch>
  )
}

export default App
