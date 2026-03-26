import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom'; // Ajustado para react-router-dom, o padrão web
import { ShoppingCart, Scooter, Package, Menu, ChevronLeft, Toolbox } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/FixNSell/vendadireta', label: 'Venda Direta', icon: ShoppingCart },
    { path: '/FixNSell/trotinetes-prontas', label: 'Trotinetes Prontas', icon: Scooter },
    { path:'/FixNSell/pecas-reservadas', label: 'Peças Reservadas', icon: Toolbox},
    { path: '/FixNSell/rececao-encomendas', label: 'Receção de Encomendas', icon: Package },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <aside
        className={`bg-white border-r border-slate-200 transition-all duration-300 ease-in-out flex flex-col shadow-sm z-20 ${
          sidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        <div className="h-20 flex items-center px-6 border-b border-slate-100 justify-between overflow-hidden">
          {sidebarOpen && (
            <div className="flex items-center gap-2 animate-in fade-in duration-500">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Scooter size={20} strokeWidth={3} />
              </div>
              <h1 className="text-xl font-black tracking-tighter text-slate-800">
                FIXN<span className="text-blue-600">SELL</span>
              </h1>
            </div>
          )}
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-all cursor-pointer ${
              !sidebarOpen ? 'mx-auto' : ''
            }`}
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all relative group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'group-hover:text-blue-600'}`} />
                
                {sidebarOpen ? (
                  <span className="truncate animate-in slide-in-from-left-2 duration-300">
                    {item.label}
                  </span>
                ) : (
                  // Tooltip básico para quando a sidebar está fechada
                  <div className="absolute left-16 bg-slate-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
                
                {isActive && sidebarOpen && (
                  <div className="ml-auto w-1.5 h-1.5 bg-blue-200 rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer da Sidebar (Opcional - Ex: Perfil ou Logout) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className={`flex items-center ${sidebarOpen ? 'gap-3' : 'justify-center'} p-2`}>
            <div className="w-8 h-8 rounded-full bg-slate-300 flex-shrink-0 border-2 border-white shadow-sm" />
            {sidebarOpen && (
              <div className="flex flex-col overflow-hidden animate-in fade-in">
                <span className="text-xs font-bold text-slate-800 truncate">Operador Loja</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Turno Ativo</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (Mobile Friendly / Page Title) */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center px-8 shrink-0">
          <div className="flex-1">
            <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Dashboard</span>
            <h2 className="text-sm font-bold text-slate-600 flex items-center gap-2">
              {menuItems.find(i => i.path === location.pathname)?.label || 'Venda Direta'}
            </h2>
          </div>
          
          {/* Aqui poderias ter notificações ou relógio */}
          <div className="flex items-center gap-4 text-slate-400">
            <div className="h-8 w-px bg-slate-100 mx-2" />
            <span className="text-xs font-mono font-medium">{new Date().toLocaleDateString('pt-PT')}</span>
          </div>
        </header>

        {/* Renderização da Página Atual */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
          {/* Container para limitar a largura em ecrãs gigantes se necessário */}
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}