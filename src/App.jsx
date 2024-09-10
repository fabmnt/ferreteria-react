import { Route, Switch } from 'wouter'
import './App.css'
import { Login } from './auth/login'
import { Register } from './auth/register'

const App = () => {
  return (
    <Switch>
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
    </Switch>
  )
}

export default App
