import { Outlet, Link, useLocation } from 'react-router';
import { ClipboardList, Wrench } from 'lucide-react';
import { RepairsProvider } from '../../context/RepairsContext';

export default function RepairsLayout() {
  const location = useLocation();

  return (
    <RepairsProvider>
      <div className="flex h-screen flex-col">
        {/* Navegação Superior */}
        <header className="bg-slate-800 bg-linear-to-r from-slate-800 to-slate-900 text-white shadow-xl">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <Wrench className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">FIXNREPAIR</h1>
                <p className="text-sm text-slate-300">Diagnóstico e Reparação de Trotinetes</p>
              </div>
            </div>

            <nav className="flex gap-2">
              <Link
                to="/FixNRepair/diagnosticos"
                className={`flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all ${
                  location.pathname === '/diagnosticos'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                <ClipboardList className="h-5 w-5" />
                Diagnósticos
              </Link>
              <Link
                to="/FixNRepair/reparacoes"
                className={`flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all ${
                  location.pathname === '/reparacoes'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
              >
                <Wrench className="h-5 w-5" />
                Reparações
              </Link>
            </nav>
          </div>
        </header>

        {/* Conteúdo da Página */}
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </RepairsProvider>
  );
}