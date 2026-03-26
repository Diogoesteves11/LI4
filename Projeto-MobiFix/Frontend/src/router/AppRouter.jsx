import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from '../pages/public/HomePage.jsx'
import HomeClientePage from '../pages/client/HomeClientePage.jsx'
import Trotinetes from '../pages/client/MinhasTrotinetesPage.jsx'
import Faturas from '../pages/client/FaturasPage.jsx'
import AgendarDiagnostico from '../pages/client/AgendarDiagnosticoPage.jsx'
import Catalogo from '../pages/client/CatalogoPecasPage.jsx'
import VendaDireta from '../pages/operator/VendaDiretaPage.jsx'
import Layout from '../pages/operator/Layout.jsx'
import TrotinetesProntas from '../pages/operator/TrotinetesProntasPage.jsx'
import PecasReservadas from '../pages/operator/PecasReservadas.jsx'
import RececaoEncomendas from '../pages/operator/RececaoEncomendasPage.jsx'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        <Route path="/FixNRide/" element={<HomeClientePage/>} />
        <Route path="/FixNRide/trotinetes" element={<Trotinetes/>} />
        <Route path="/FixNRide/faturas" element={<Faturas/>} />
        <Route path="/FixNRide/agendar" element={<AgendarDiagnostico/>} />
        <Route path="/FixNRide/catalogo" element={<Catalogo/>} />

        <Route path="/FixNSell" element={<Layout />}>
          <Route path="vendadireta" element={<VendaDireta />} />
          <Route path="trotinetes-prontas" element={<TrotinetesProntas />} />
          <Route path="pecas-reservadas" element={<PecasReservadas />} />
          <Route path="rececao-encomendas" element={<RececaoEncomendas />} />

          <Route index element={<VendaDireta />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}