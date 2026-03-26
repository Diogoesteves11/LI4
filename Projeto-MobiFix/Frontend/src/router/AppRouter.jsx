import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '../pages/public/HomePage.jsx'
import HomeClientePage from '../pages/client/HomeClientePage.jsx'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cliente" element={<HomeClientePage/>} />
      </Routes>
    </BrowserRouter>
  )
}