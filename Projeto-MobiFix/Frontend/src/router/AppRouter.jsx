import { BrowserRouter, Routes, Navigate, Route } from 'react-router-dom'
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
import RepairsLayout from '../pages/mechanic/RepairsLayout.jsx'
import Dashboard from '../pages/mechanic/Dashboard.jsx'
import Repairs from '../pages/mechanic/Repairs.jsx'
import AdminLayout from '../pages/admin/AdminLayout.jsx'
import StockOrders from '../pages/admin/EncomendasStock.jsx'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import UserManagement from '../pages/admin/GestaoUsers.jsx'
import Promotions from '../pages/admin/Promocoes.jsx'
import LoginPage from '../pages/staff/LoginPage.jsx'
import AuthPage from '../pages/public/AuthPage.jsx'


const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user_role');

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    console.warn("Acesso negado: Role insuficiente.");
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // Renderiza as rotas filhas
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROTAS PÚBLICAS */}
        <Route path="/" element={<HomePage/>} />
        <Route path="/auth" element={<AuthPage />} />

        {/* ÁREA DO CLIENTE - Só para 'Cliente' */}
        <Route element={<ProtectedRoute allowedRoles={['Cliente']} />}>
          <Route path="/FixNRide/" element={<HomeClientePage/>} />
          <Route path="/FixNRide/trotinetes" element={<Trotinetes/>} />
          <Route path="/FixNRide/faturas" element={<Faturas/>} />
          <Route path="/FixNRide/agendar" element={<AgendarDiagnostico/>} />
          <Route path="/FixNRide/catalogo" element={<Catalogo/>} />
        </Route>

        {/* ÁREA DO OPERADOR - Operador e Admin podem entrar */}
        <Route element={<ProtectedRoute allowedRoles={['Operador', 'Administrador']} />}>
          <Route path="/staff" element={<LoginPage/>} />
          <Route path="/FixNSell" element={<Layout />}>
            <Route path="vendadireta" element={<VendaDireta />} />
            <Route path="trotinetes-prontas" element={<TrotinetesProntas />} />
            <Route path="pecas-reservadas" element={<PecasReservadas />} />
            <Route path="rececao-encomendas" element={<RececaoEncomendas />} />
            <Route index element={<VendaDireta />} />
          </Route>
        </Route>
        
        {/* ÁREA DO MECÂNICO - Mecânico e Admin podem entrar */}
        <Route element={<ProtectedRoute allowedRoles={['Mecanico', 'Administrador']} />}>
          <Route path="/FixNRepair/" element={<RepairsLayout />}>
            <Route path="diagnosticos" element={<Dashboard />}/>
            <Route path="reparacoes" element={<Repairs />} />
            <Route index element={<Dashboard />} />
          </Route>
        </Route>

        {/* ÁREA DO ADMIN - Só para 'Administrador' */}
        <Route element={<ProtectedRoute allowedRoles={['Administrador']} />}>
          <Route path="/FixNManage/" element={<AdminLayout/>}>
            <Route path="encomendas" element={<StockOrders/>}/>
            <Route path="dashboard" element={<AdminDashboard/>}/>
            <Route path="users" element={<UserManagement/>}/>
            <Route path="promocoes" element={<Promotions/>}/>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* Rota de Catch-all (404 ou redirecionar) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}