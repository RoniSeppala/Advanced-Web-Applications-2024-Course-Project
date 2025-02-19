import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import Home from "./components/Home"
import Header from "./components/Header"


function App() {

  return (
    <>
        <BrowserRouter>
        <Header/>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<h1>404: Page not found</h1>} />
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
