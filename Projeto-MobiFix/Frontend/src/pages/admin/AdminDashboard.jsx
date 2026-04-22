import { useEffect, useState, useCallback } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Clock, Euro, TrendingUp, Wrench, Calendar, ShoppingCart, Undo2, Filter, X, ChevronRight } from "lucide-react";
import { statsService } from "../../services/statsService";

const MODO_ALLTIME = "alltime";
const MODO_DIA = "dia";
const MODO_INTERVALO = "intervalo";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [modo, setModo] = useState(MODO_ALLTIME);
  const [dia, setDia] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");

  const formatarParaDataLocal = (dataStr) => {
    if (!dataStr) return null;
    const [ano, mes, dia] = dataStr.split("-").map(Number);
    return new Date(ano, mes - 1, dia); // Meses no JS começam em 0
  };

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
     let dados;
      if (modo === MODO_DIA && dia) {
        // Passamos a string "2024-03-28" diretamente, sem o "new Date()"
        dados = await statsService.getEstatisticasDia(dia); 
      } else if (modo === MODO_INTERVALO && inicio && fim) {
        dados = await statsService.getEstatisticasIntervalo(inicio, fim);
      } else {
        dados = await statsService.getEstatisticasGlobais();
      }
      setStats(dados); 
    } catch (e) {
      setErro(e.message ?? "Erro a obter estatísticas.");
    } finally {
      setLoading(false);
    }
  }, [modo, dia, inicio, fim]);

  useEffect(() => {
    if (modo === MODO_ALLTIME) carregar();
  }, [modo, carregar]);

  const aplicarFiltro = () => {
    if (modo === MODO_DIA && !dia) return;
    if (modo === MODO_INTERVALO && (!inicio || !fim)) return;
    carregar();
  };

  const limparFiltros = () => {
    setDia("");
    setInicio("");
    setFim("");
    setModo(MODO_ALLTIME);
  };

  const rotuloPeriodo = (() => {
    if (modo === MODO_DIA && dia) {
      const d = formatarParaDataLocal(dia);
      return `Dia ${d.toLocaleDateString("pt-PT")}`;
    }
    if (modo === MODO_INTERVALO && inicio && fim) {
      const i = formatarParaDataLocal(inicio);
      const f = formatarParaDataLocal(fim);
      return `${i.toLocaleDateString("pt-PT")} — ${f.toLocaleDateString("pt-PT")}`;
    }
    return "All time";
  })();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Dashboard Executivo</h1>
          <p className="text-lg font-medium text-slate-500">
            Métricas operacionais e financeiras · <span className="text-slate-700 font-bold">{rotuloPeriodo}</span>
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex items-center gap-2 text-slate-900 font-black">
            <Filter className="w-5 h-5 text-blue-600" /> Filtros
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Período</label>
            <select
              value={modo}
              onChange={(e) => setModo(e.target.value)}
              className="rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none"
            >
              <option value={MODO_ALLTIME}>All time</option>
              <option value={MODO_DIA}>Dia específico</option>
              <option value={MODO_INTERVALO}>Intervalo</option>
            </select>
          </div>

          {modo === MODO_DIA && (
            <div className="flex flex-col">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Dia</label>
              <input
                type="date"
                value={dia}
                onChange={(e) => setDia(e.target.value)}
                className="rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {modo === MODO_INTERVALO && (
            <>
              <div className="flex flex-col">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Início</label>
                <input
                  type="date"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                  className="rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Fim</label>
                <input
                  type="date"
                  value={fim}
                  onChange={(e) => setFim(e.target.value)}
                  className="rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {modo !== MODO_ALLTIME && (
            <button
              onClick={aplicarFiltro}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black px-5 py-2 text-sm transition-colors"
            >
              Aplicar
            </button>
          )}

          {modo !== MODO_ALLTIME && (
            <button
              onClick={limparFiltros}
              className="flex items-center gap-1 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-black px-4 py-2 text-sm transition-colors"
            >
              <X className="w-4 h-4" /> Limpar
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500 font-medium">A carregar estatísticas...</p>
        </div>
      ) : erro || !stats ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-red-600 font-medium">{erro ?? "Sem dados disponíveis."}</p>
        </div>
      ) : (
        <Conteudo stats={stats} />
      )}
    </div>
  );
}

function Conteudo({ stats }) {
  const [detalhe, setDetalhe] = useState(null);

  const tempoMedioHoras = (stats.TempoMedioServicoMinutos / 60).toFixed(1);
  const faturacaoK = (Number(stats.FaturacaoTotal) / 1000).toFixed(1);

  const cards = [
    { key: "tempo", name: "Tempo Médio", value: `${tempoMedioHoras}h`, icon: Clock, color: "blue" },
    { key: "faturacao", name: "Faturação", value: `€${faturacaoK}k`, icon: Euro, color: "emerald" },
    { key: "servicos", name: "Serviços", value: stats.ServicosRealizados, icon: Wrench, color: "indigo" },
    { key: "agendamentos", name: "Agendamentos", value: stats.NumeroAgendamentos, icon: Calendar, color: "purple" },
    { key: "vendas", name: "Vendas", value: stats.NumeroVendas, icon: ShoppingCart, color: "amber" },
    { key: "devolucoes", name: "Devoluções", value: `€${Number(stats.ValorTotalDevolucoes).toFixed(0)}`, icon: Undo2, color: "rose" },
  ];

  const revenueData = [
    { name: "Serviços", value: Number(stats.FaturacaoServicos), color: "#2563eb" },
    { name: "Vendas", value: Number(stats.FaturacaoVendas), color: "#10b981" },
  ];

  const porMes = {};
  for (const m of stats.Movimentacao ?? []) {
    const data = new Date(m.Fatura.DataEmissao);
    const chave = data.toLocaleString("pt-PT", { month: "short" });
    porMes[chave] = (porMes[chave] ?? 0) + Number(m.Valor);
  }
  const movimentacaoData = Object.entries(porMes).map(([mes, valor]) => ({ mes, valor }));

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {cards.map((stat) => (
          <button
            key={stat.key}
            onClick={() => setDetalhe(stat.key)}
            className="group bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 text-left cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 group-hover:bg-${stat.color}-600 transition-colors`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 group-hover:text-white`} />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.name}</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
          </button>
        ))}
      </div>

      {detalhe && (
        <DetalheModal chave={detalhe} stats={stats} onClose={() => setDetalhe(null)} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" /> Faturação por Mês (€)
          </h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={movimentacaoData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="valor" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-sm flex flex-col">
          <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
            <Euro className="w-5 h-5 text-emerald-600" /> Origem da Faturação
          </h2>
          <div className="flex-1 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value">
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
            {revenueData.map((item) => (
              <div key={item.name} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">{item.name}</span>
                </div>
                <span className="text-xl font-black text-slate-900">€{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function DetalheModal({ chave, stats, onClose }) {
  const configs = {
    tempo: { titulo: "Detalhes · Tempo Médio", icon: Clock, cor: "blue" },
    faturacao: { titulo: "Detalhes · Faturação", icon: Euro, cor: "emerald" },
    servicos: { titulo: "Detalhes · Serviços", icon: Wrench, cor: "indigo" },
    agendamentos: { titulo: "Detalhes · Agendamentos", icon: Calendar, cor: "purple" },
    vendas: { titulo: "Detalhes · Vendas", icon: ShoppingCart, cor: "amber" },
    devolucoes: { titulo: "Detalhes · Devoluções", icon: Undo2, cor: "rose" },
  };
  const cfg = configs[chave];
  const Icon = cfg.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b-2 border-slate-100">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <span className={`p-2 rounded-xl bg-${cfg.cor}-50`}>
              <Icon className={`w-6 h-6 text-${cfg.cor}-600`} />
            </span>
            {cfg.titulo}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {chave === "faturacao" && <DetalheFaturacao stats={stats} />}
          {chave === "tempo" && <DetalheTempo stats={stats} />}
          {chave === "servicos" && <DetalheServicos stats={stats} />}
          {chave === "vendas" && <DetalheVendas stats={stats} />}
          {chave === "agendamentos" && <DetalheAgendamentos stats={stats} />}
          {chave === "devolucoes" && <DetalheDevolucoes stats={stats} />}
        </div>
      </div>
    </div>
  );
}

function DetalheFaturacao({ stats }) {
  const mov = stats.Movimentacao ?? [];
  const servicos = mov.filter((m) => m.Categoria === "SERVICO");
  const vendas = mov.filter((m) => m.Categoria === "VENDA");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Resumo rotulo="Total" valor={`€${Number(stats.FaturacaoTotal).toFixed(2)}`} cor="slate" />
        <Resumo rotulo="Serviços" valor={`€${Number(stats.FaturacaoServicos).toFixed(2)}`} cor="blue" />
        <Resumo rotulo="Vendas" valor={`€${Number(stats.FaturacaoVendas).toFixed(2)}`} cor="emerald" />
      </div>

      <SeccaoLista titulo={`Faturas de Serviços (${servicos.length})`}>
        {servicos.length === 0 ? (
          <Vazio texto="Sem faturas de serviços no período." />
        ) : (
          servicos.map((m) => <LinhaFatura key={m.Fatura.NumeroFatura} mov={m} />)
        )}
      </SeccaoLista>

      <SeccaoLista titulo={`Faturas de Vendas (${vendas.length})`}>
        {vendas.length === 0 ? (
          <Vazio texto="Sem faturas de vendas no período." />
        ) : (
          vendas.map((m) => <LinhaFatura key={m.Fatura.NumeroFatura} mov={m} />)
        )}
      </SeccaoLista>
    </div>
  );
}

function DetalheTempo({ stats }) {
  const horas = (stats.TempoMedioServicoMinutos / 60).toFixed(2);
  return (
    <div className="space-y-4">
      <Resumo rotulo="Tempo Médio por Intervenção" valor={`${horas}h (${stats.TempoMedioServicoMinutos.toFixed(0)} min)`} cor="blue" />
      <p className="text-sm text-slate-500 font-medium">
        Cálculo baseado em todas as intervenções registadas nos serviços do período. Quanto mais intervenções concluídas, mais
        preciso é o valor.
      </p>
    </div>
  );
}

function DetalheServicos({ stats }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Resumo rotulo="Concluídos" valor={stats.ServicosRealizados} cor="indigo" />
        <Resumo rotulo="Faturação Gerada" valor={`€${Number(stats.FaturacaoServicos).toFixed(2)}`} cor="blue" />
      </div>
      <p className="text-sm text-slate-500 font-medium">
        Contabiliza serviços em estado CONCLUIDO ou FINALIZADO no período selecionado.
      </p>
    </div>
  );
}

function DetalheVendas({ stats }) {
  const vendas = (stats.Movimentacao ?? []).filter((m) => m.Categoria === "VENDA");
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Resumo rotulo="Nº Vendas" valor={stats.NumeroVendas} cor="amber" />
        <Resumo rotulo="Faturação" valor={`€${Number(stats.FaturacaoVendas).toFixed(2)}`} cor="emerald" />
      </div>

      <SeccaoLista titulo="Lista de Vendas">
        {vendas.length === 0 ? <Vazio texto="Sem vendas no período." /> : vendas.map((m) => <LinhaFatura key={m.Fatura.NumeroFatura} mov={m} />)}
      </SeccaoLista>
    </div>
  );
}

function DetalheAgendamentos({ stats }) {
  return (
    <div className="space-y-4">
      <Resumo rotulo="Nº Agendamentos" valor={stats.NumeroAgendamentos} cor="purple" />
      <p className="text-sm text-slate-500 font-medium">
        Número de slots agendados na agenda no período. Inclui diagnósticos e reparações atribuídos a mecânicos.
      </p>
    </div>
  );
}

function DetalheDevolucoes({ stats }) {
  const devs = stats.Devolucoes ?? [];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Resumo rotulo="Nº Devoluções" valor={devs.length} cor="rose" />
        <Resumo rotulo="Valor Creditado" valor={`€${Number(stats.ValorTotalDevolucoes).toFixed(2)}`} cor="rose" />
      </div>

      <SeccaoLista titulo="Lista de Devoluções">
        {devs.length === 0 ? (
          <Vazio texto="Sem devoluções no período." />
        ) : (
          devs.map((d, idx) => (
            <div key={d.DevolucaoID ?? idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="font-black text-slate-900">{d.Motivo || "Sem motivo"}</p>
                <p className="text-xs text-slate-500 font-medium">
                  {d.DataDevolucao ? new Date(d.DataDevolucao).toLocaleDateString("pt-PT") : "—"}
                </p>
              </div>
              <p className="text-lg font-black text-rose-600">
                €{Number(d.NotaCredito?.ValorCreditado ?? 0).toFixed(2)}
              </p>
            </div>
          ))
        )}
      </SeccaoLista>
    </div>
  );
}

function Resumo({ rotulo, valor, cor }) {
  return (
    <div className={`p-4 rounded-2xl bg-${cor}-50 border-2 border-${cor}-100`}>
      <p className="text-xs font-black uppercase tracking-widest text-slate-500">{rotulo}</p>
      <p className="text-2xl font-black text-slate-900 mt-1">{valor}</p>
    </div>
  );
}

function SeccaoLista({ titulo, children }) {
  return (
    <div>
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-3">{titulo}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Vazio({ texto }) {
  return <p className="text-sm text-slate-400 font-medium italic p-4 text-center">{texto}</p>;
}

function LinhaFatura({ mov }) {
  const f = mov.Fatura;
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="font-black text-slate-900 truncate">Fatura {f.NumeroFatura}</p>
        <p className="text-xs text-slate-500 font-medium">
          NIF {f.ClienteNIF} · {new Date(f.DataEmissao).toLocaleDateString("pt-PT")} · {f.MetodoPagamento}
          {f.ServicoID ? ` · Serviço #${f.ServicoID}` : ""}
          {f.VendaID ? ` · Venda #${f.VendaID}` : ""}
        </p>
      </div>
      <p className="text-lg font-black text-slate-900 ml-4">€{Number(mov.Valor).toFixed(2)}</p>
    </div>
  );
}
