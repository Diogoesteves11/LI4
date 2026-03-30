import { Calendar, Scooter, ShoppingCart, Bell, User,Wrench } from "lucide-react";
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
      path: "/FixNRide/agendar"
    },
    {
      label: "Catálogo de Peças", 
      desc: "Reserve peças para levantar", 
      icon: ShoppingCart, 
      color: "bg-purple-100 text-purple-600", 
      path: "/FixNRide/catalogo" 
    },
  ]

  const nome = localStorage.getItem('user_name');
  return (
      <main className="min-h-screen bg-slate-50 pb-24 font-sans antialiased">
      {/* Header Estilo Premium */}
      <header className="relative bg-blue-600 text-white px-6 pt-12 pb-12 rounded-b-[3rem] shadow-2xl shadow-blue-200 overflow-hidden">
        {/* Elemento Decorativo de Fundo */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-20 -left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center border border-white/30 shadow-inner">
                <Scooter className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tighter leading-none">
                  FIXN<span className="text-blue-200">RIDE</span>
                </h1>
                <p className="text-[10px] text-blue-100 font-bold uppercase tracking-[0.2em] opacity-80">
                  Service Center
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <p className="text-blue-100 text-sm font-medium">Bem vindo,</p>
              <h2 className="text-2xl font-black tracking-tight">{nome} 👋</h2>
            </div>
          </div>
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