import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '../pages/public/HomePage.jsx'
import HomeClientePage from '../pages/client/HomeClientePage.jsx'
import Trotinetes from '../pages/client/MinhasTrotinetesPage.jsx'
import Faturas from '../pages/client/FaturasPage.jsx'
import AgendarDiagnostico from '../pages/client/AgendarDiagnosticoPage.jsx'
import Catalogo from '../pages/client/CatalogoPecasPage.jsx'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cliente" element={<HomeClientePage/>} />
        <Route path="/trotinetes" element={<Trotinetes/>} />
        <Route path="/faturas" element={<Faturas/>} />
        <Route path="/agendar" element={<AgendarDiagnostico/>} />
        <Route path="/catalogo" element={<Catalogo/>} />
      </Routes>
    </BrowserRouter>
  )
}