import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import './css/App.css'

import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Join from './pages/Join'
import UserHome from './pages/UserHome'
import UserDashboard from './pages/UserDashboard'

import AppContext from './context/AppContext'

function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  
  useEffect(() => {
    fetch('/api/check_session')
    .then(r => {
       if (r.ok) {
         r.json().then(user => setUser(user))
       }
    })
  }, [])

  function handleLogout() {
    fetch('/api/logout').then(r => {
      if (r.ok) {
        setUser(null)
        navigate('/login')
      }
    })
  }

  return (
    <>
      <div className='site-header'>
        <h1>whatcha' watchin'</h1>
        {user ? <button id='logout' onClick={handleLogout}>logout</button> : null}
      </div>
      <AppContext.Provider value={
        {
          user: user,
          setUser: setUser,
          navigate: navigate,
        }
      }>
        <Routes>
          <Route path='/' element={<Home />} >
            <Route path='/' element={<About />} />
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<Signup />} />
            <Route path='join' element={<Join />} />
          </Route>
          <Route path='/user' element={<UserHome />} >
            <Route path='/user' element={<UserDashboard />} />
          </Route>
        </Routes>
      </AppContext.Provider>
    </>
  );
}

export default App;
