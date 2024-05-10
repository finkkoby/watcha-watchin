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
import NewRoom from './pages/NewRoom'
import ViewingRoom from './pages/ViewingRoom'

import AppContext from './context/AppContext'

function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    console.log(user)
  }, [user])

  useEffect(() => {
    fetch('/api/check_session')
    .then(r => {
       if (r.ok) {
         r.json().then(user => setUser(user))
       } else {
         r.json().then(res => {
           console.log(res)
           setUser(null)
         })
       }
    })
  }, [])

  function handleUpdate(user) {
    fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        room: user.room,
      })
    }).then(r => {
        if (r.ok) {
          r.json().then(res => {
            console.log(res)
            setUser(res)
          })
        } else {
          r.json().then(res => {
            console.log(res.message)
          })
        }
      })
  }

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
        <div className='site-box'>
          { user ? <p><em>welcome, {user.first_name}</em></p> : null}
        </div>
        <h1>whatcha' watchin'</h1>
        <div className='site-box'>
          {user ? <button id='logout' onClick={handleLogout}>logout</button> : null}
        </div>
      </div>
      <AppContext.Provider value={
        {
          user: user,
          setUser: setUser,
          navigate: navigate,
          handleUpdate: handleUpdate,
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
            <Route path='/user/room/new' element={<NewRoom />} />
            <Route path='/user/room/:id' element={<ViewingRoom />} />
          </Route>
        </Routes>
      </AppContext.Provider>
    </>
  );
}

export default App;
