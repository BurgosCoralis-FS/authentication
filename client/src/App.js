import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Movie from './pages/Movie'
import authService from './services/auth.service'

function App() {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const user = authService.getCurrentUser()
    if(user){ setCurrentUser(user) }
  }, [])

  const logout = () => {
    authService.logout()
  }
  
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/dashboard' exact element={<Dashboard />} />
          <Route path='/movies/:id' exact element={<Movie />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;