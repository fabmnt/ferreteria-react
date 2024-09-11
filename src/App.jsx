import { Route, Switch } from 'wouter'
import './App.css'
import { Login } from './auth/login'
import { Register } from './auth/register'
import { useSession } from './auth/session'
import { useEffect } from 'react'

const App = () => {
  const { session } = useSession()

  useEffect(() => {
    console.log({ session })
  }, [session])

  return (
    <Switch>
      <Route path='/login' component={Login} />
      <Route path='/register' component={Register} />
    </Switch>
  )
}

export default App
