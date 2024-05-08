
import { Routes, Route } from 'react-router-dom'

import './css/App.css'

import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Join from './pages/Join'
import UserHome from './pages/UserHome'

function App() {
  return (
    <>
      <div className='site-header'>
        <h1>whatcha' watchin'</h1>
      </div>
      <Routes>
        <Route path='/' element={<Home />} >
          <Route path='/' element={<About />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
          <Route path='join' element={<Join />} />
        </Route>
        <Route path='/user' element={<UserHome />} />
      </Routes>
    </>
  );
}

export default App;
