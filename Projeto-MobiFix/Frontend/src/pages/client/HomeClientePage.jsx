import { Calendar, ShoppingCart, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/BottomNav";

export default function HomeClientePage() {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: "Agendar Diagnóstico",
      desc: "Marque um diagnóstico",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
      path: "/agendar"
    },
    {
      label: "Catálogo de Peças", 
      desc: "Reserve peças para levantar", 
      icon: ShoppingCart, 
      color: "bg-purple-100 text-purple-600", 
      path: "/catalogo" 
    },
  ]
  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Header - Usando tons de Slate e Blue do v4 */}
      <header className="bg-blue-600 text-white px-5 py-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Fix'n'Ride</h1>
            <p className="text-xs text-blue-100 opacity-80 uppercase tracking-widest">Oficina de Trotinetes</p>
          </div>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-blue-100">Bem-vindo de volta,</p>
          <p className="text-xl font-semibold">João Silva 👋</p>
        </div>
      </header>

      {/* Quick Actions - Geradas via Loop */}
      <section className="px-4 py-8">
        <h2 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider ml-1">
          Ações Rápidas
        </h2>
        <div className="grid gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all border border-slate-100"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center shrink-0`}>
                <action.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-slate-900">{action.label}</h3>
                <p className="text-sm text-slate-500">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Active Repairs */}
      <section className="px-4 pb-4">
        <h2 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider ml-1">
          Reparações Ativas
        </h2>
        
        <div className="space-y-4">
          {/* Card 1 - Em Reparação */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-slate-900">Xiaomi Mi Pro 2</h3>
                <p className="text-xs font-mono text-slate-400">XM2023-4567</p>
              </div>
              <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full uppercase">
                Em Oficina
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>Estado da Reparação</span>
                <span className="text-orange-600">60%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-orange-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: "60%" }}
                />
              </div>
            </div>
          </div>

          {/* Card 2 - Pronta */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 border-l-4 border-l-emerald-500">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900">Segway Ninebot Max</h3>
                <p className="text-xs font-mono text-slate-400">SG2023-8901</p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full uppercase">
                Pronta
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Pode levantar o seu veículo hoje.
            </p>
          </div>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}