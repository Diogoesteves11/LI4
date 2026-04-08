import { Link, Outlet, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  Users, 
  Wrench,
  Box 
} from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/FixNManage/dashboard", icon: LayoutDashboard },
    { name: "Encomendas Pendentes", href: "/FixNManage/encomendas", icon: Package },
    { name: "Promoções", href: "/FixNManage/promocoes", icon: Tag },
    { name: "Utilizadores", href: "/FixNManage/users", icon: Users },
    { name: "Catálogo de Peças", href: "/FixNManage/pecas", icon: Box }, 
  ];

  const isActive = (href) => {
    if (href === "/FixNManage/") {
      return location.pathname === "/FixNManage/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white">
        <div className="flex items-center gap-3 p-6 border-b border-gray-800">
          <Wrench className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="font-bold text-xl">FixNManage</h1>
            <p className="text-xs text-gray-400">Painel Administrativo</p>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
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
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}