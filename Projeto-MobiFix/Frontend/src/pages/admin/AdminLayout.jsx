import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  Users, 
  Wrench,
  Box,
  LogOut // Ícone importado
} from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate(); // Hook para redirecionar após o logout

  const navigation = [
    { name: "Dashboard", href: "/FixNManage/dashboard", icon: LayoutDashboard },
    { name: "Encomendas Pendentes", href: "/FixNManage/encomendas", icon: Package },
    { name: "Promoções", href: "/FixNManage/promocoes", icon: Tag },
    { name: "Utilizadores", href: "/FixNManage/users", icon: Users },
    { name: "Catálogo de Peças", href: "/FixNManage/pecas", icon: Box },
    { name: "Intervenções", href: "/FixNManage/intervencoes", icon: Wrench },
  ];

  const isActive = (href) => {
    if (href === "/FixNManage/") {
      return location.pathname === "/FixNManage/";
    }
    return location.pathname.startsWith(href);
  };

  // Função para tratar do processo de logout
  const handleLogout = () => {
    if (window.confirm("Deseja terminar a sessão?")) {
      localStorage.removeItem("token"); // Limpa a sessão
      navigate("/"); // Redireciona para a página de Login (ajusta a rota se necessário)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Adicionado flex e flex-col para podermos empurrar elementos para baixo */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col">
        <div className="flex items-center gap-3 p-6 border-b border-gray-800">
          <Wrench className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="font-bold text-xl">FixNManage</h1>
            <p className="text-xs text-gray-400">Painel Administrativo</p>
          </div>
        </div>
        
        {/* Adicionado flex-1 para que os links ocupem o espaço livre e empurrem o footer */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Rodapé da Sidebar com o Botão de Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Terminar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}