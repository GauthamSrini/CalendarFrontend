import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import SideNavBar from './components/SideNavBar'
import Home from './pages/Home'
import Events from './pages/Events'

function App() {
  return (
    <div className='MainLayout'>
      <div><SideNavBar/></div>
      <div>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/events' element={<Events/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
