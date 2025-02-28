import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Home from "./components/Home"
import Header from "./components/Header"
import { ChromePicker } from 'react-color'
import React from 'react'

function App() {
  const [color, setColor] = React.useState<string>("#000000")

  return (
    <>
        <BrowserRouter>
        <Header/>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/chrome" element={
              <div>
                <ChromePicker color={color} onChange={(newColor) => {console.log(newColor.hex); setColor(newColor.hex)}}/>
              </div>
            } />
            <Route path="*" element={<h1>404: Page not found</h1>} />
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
