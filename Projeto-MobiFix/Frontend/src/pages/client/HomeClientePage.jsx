import { Calendar, Scooter, ShoppingCart, Wrench, CheckCircle2, Clock, Hourglass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import BottomNav from "../../components/BottomNav";
import { useTrotinetes } from "../../hooks/useTrotinetes";
import { useServicos } from "../../hooks/useServicos";

export default function HomeClientePage() {
  const navigate = useNavigate();
  const { data: trotinetes = [] } = useTrotinetes();
  const { data: servicos = [] } = useServicos();

  const reparacoesAtivas = useMemo(() => {
    if (!trotinetes.length || !servicos.length) return [];
    const series = new Set(trotinetes.map(t => t.NumeroSerie));
    return servicos
      .filter(s => series.has(s.TrotineteNumSerie))
      .filter(s => ['AGENDADO', 'EXECUCAO', 'CONCLUIDO'].includes(s.Estado))
      .sort((a, b) => new Date(b.DataAgendamento) - new Date(a.DataAgendamento))
      .slice(0, 3)
      .map(s => ({ ...s, trot: trotinetes.find(t => t.NumeroSerie === s.TrotineteNumSerie) }));
  }, [trotinetes, servicos]);

  const quickActions = [
    {
      label: "Agendar Diagnóstico",
      desc: "Marque um diagnóstico",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
      path: "/FixNRide/agendar"
    },
    {
      label: "Minhas Reparações",
      desc: "Acompanhar estado + histórico",
      icon: Wrench,
      color: "bg-emerald-100 text-emerald-600",
      path: "/FixNRide/reparacoes"
    },
    {
      label: "Catálogo de Peças",
      desc: "Reserve peças para levantar",
      icon: ShoppingCart,
      color: "bg-purple-100 text-purple-600",
      path: "/FixNRide/catalogo"
    },
  ]

  function parseJwt(token) {
    try {
      const base64Payload = token.split('.')[1];
      const decoded = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  const token = localStorage.getItem('token');
  if (!token) return null;
  const payload = parseJwt(token);

  const nome = payload?.nome ?? null;
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
        <div className="flex items-center justify-between mb-4 ml-1">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Reparações Ativas
          </h2>
          {reparacoesAtivas.length > 0 && (
            <button
              onClick={() => navigate('/FixNRide/reparacoes')}
              className="text-xs font-bold text-blue-600 uppercase tracking-wider"
            >
              Ver todas
            </button>
          )}
        </div>

        {reparacoesAtivas.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-100">
            <Scooter className="w-10 h-10 mx-auto text-slate-200 mb-2" />
            <p className="text-slate-400 font-medium text-sm">Sem reparações em curso.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reparacoesAtivas.map(r => {
              const estadoMeta = {
                AGENDADO:  { label: 'Agendado',  pct: 10,  color: 'bg-blue-100 text-blue-700',       bar: 'bg-blue-500',    icon: Hourglass },
                EXECUCAO:  { label: 'Em Oficina', pct: 55, color: 'bg-orange-100 text-orange-700',   bar: 'bg-orange-500',  icon: Wrench },
                CONCLUIDO: { label: 'Pronta',    pct: 100, color: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500', icon: CheckCircle2 },
              }[r.Estado];
              const Icon = estadoMeta.icon;
              return (
                <button
                  key={r.ServicoID}
                  onClick={() => navigate('/FixNRide/reparacoes')}
                  className={`w-full text-left bg-white rounded-2xl p-5 shadow-sm border border-slate-100 active:scale-[0.99] transition-all ${
                    r.Estado === 'CONCLUIDO' ? 'border-l-4 border-l-emerald-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {r.trot?.Marca ?? 'Trotinete'} {r.trot?.Modelo ?? ''}
                      </h3>
                      <p className="text-xs font-mono text-slate-400">{r.TrotineteNumSerie}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1 ${estadoMeta.color}`}>
                      <Icon size={11} /> {estadoMeta.label}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span>Progresso</span>
                      <span>{estadoMeta.pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className={`${estadoMeta.bar} h-full rounded-full transition-all duration-700`} style={{ width: `${estadoMeta.pct}%` }} />
                    </div>
                  </div>
                  {r.Estado === 'CONCLUIDO' && (
                    <p className="text-xs text-emerald-600 mt-3 flex items-center gap-2 font-medium">
                      <Clock size={12} /> Pode levantar o seu veículo.
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}