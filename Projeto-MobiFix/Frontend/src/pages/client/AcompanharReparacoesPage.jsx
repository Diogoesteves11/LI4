import { useMemo } from 'react';
import { Loader2, Wrench, CheckCircle2, Clock, Bike, Euro, AlertCircle, Hourglass, Package } from 'lucide-react';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import { useTrotinetes } from '../../hooks/useTrotinetes';
import { useServicos } from '../../hooks/useServicos';
import { useIntervencoesCatalogo } from '../../hooks/useIntervencoesCatalogo';

const ESTADO_META = {
  AGENDADO:  { label: 'Agendado',  color: 'bg-blue-100 text-blue-700',       pct: 10,  icon: Hourglass },
  EXECUCAO:  { label: 'Em Oficina', color: 'bg-orange-100 text-orange-700',  pct: 55,  icon: Wrench },
  CONCLUIDO: { label: 'Pronta',    color: 'bg-emerald-100 text-emerald-700', pct: 100, icon: CheckCircle2 },
  FECHADO:   { label: 'Entregue',  color: 'bg-slate-100 text-slate-600',     pct: 100, icon: CheckCircle2 },
};

function formatDate(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' }); }
  catch { return '—'; }
}

export default function AcompanharReparacoes() {
  const { data: trotinetes = [], isLoading: loadingTrot, isError: errorTrot } = useTrotinetes();
  const { data: servicos = [], isLoading: loadingServ, isError: errorServ } = useServicos();
  const { data: catalogo = [] } = useIntervencoesCatalogo();

  const reparacoes = useMemo(() => {
    if (!trotinetes.length || !servicos.length) return [];
    const seriesCliente = new Set(trotinetes.map(t => t.NumeroSerie));

    return servicos
      .filter(s => seriesCliente.has(s.TrotineteNumSerie))
      .sort((a, b) => new Date(b.DataAgendamento) - new Date(a.DataAgendamento))
      .map(s => {
        const trot = trotinetes.find(t => t.NumeroSerie === s.TrotineteNumSerie);
        const intervencoes = (s.HistoricoIntervencoes ?? []).map(h => {
          const cat = catalogo.find(c => c.IntervencaoID === h.IntervencaoCatalogoID);
          return {
            id: h.IntervencaoCatalogoID,
            descricao: cat?.Descricao ?? `Intervenção #${h.IntervencaoCatalogoID}`,
            preco: cat?.PrecoFixoMaoDeObra ?? 0,
            tempo: h.TempoGastoMinutos ?? null,
            dataFim: h.DataFim,
            pecas: h.PecasUtilizadas ?? [],
          };
        });
        return { ...s, trot, intervencoes };
      });
  }, [trotinetes, servicos, catalogo]);

  const ativas = reparacoes.filter(r => r.Estado === 'AGENDADO' || r.Estado === 'EXECUCAO' || r.Estado === 'CONCLUIDO');
  const historico = reparacoes.filter(r => r.Estado === 'FECHADO');

  if (loadingTrot || loadingServ) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </main>
    );
  }

  if (errorTrot || errorServ) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 p-6">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="font-bold text-slate-700">Erro ao carregar reparações.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-sans antialiased">
      <Header title="Reparações" />

      <section className="px-4 pt-6">
        <h2 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider ml-1">
          Reparações Ativas ({ativas.length})
        </h2>

        {ativas.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
            <Bike className="w-12 h-12 mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 font-medium text-sm">Nenhuma reparação em curso.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ativas.map(r => <ServicoCard key={r.ServicoID} servico={r} />)}
          </div>
        )}
      </section>

      <section className="px-4 pt-8">
        <h2 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider ml-1">
          Histórico ({historico.length})
        </h2>

        {historico.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
            <p className="text-slate-400 font-medium text-sm">Ainda sem reparações concluídas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {historico.map(r => <ServicoCard key={r.ServicoID} servico={r} compact />)}
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}

function ServicoCard({ servico, compact = false }) {
  const meta = ESTADO_META[servico.Estado] ?? ESTADO_META.AGENDADO;
  const Icon = meta.icon;
  const total = servico.intervencoes.reduce((s, i) => s + (i.preco ?? 0), 0);
  const tempoTotal = servico.intervencoes.reduce((s, i) => s + (i.tempo ?? 0), 0);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            {servico.trot?.Marca ?? 'Trotinete'} {servico.trot?.Modelo ?? ''}
          </h3>
          <p className="text-xs font-mono text-slate-400">{servico.TrotineteNumSerie}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
            Serviço #{servico.ServicoID} · {formatDate(servico.DataAgendamento)}
          </p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1 ${meta.color}`}>
          <Icon size={11} /> {meta.label}
        </span>
      </div>

      {!compact && (
        <div className="mb-3">
          <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
            <span>Progresso</span>
            <span>{meta.pct}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                servico.Estado === 'CONCLUIDO' ? 'bg-emerald-500' :
                servico.Estado === 'EXECUCAO'  ? 'bg-orange-500'  : 'bg-blue-500'
              }`}
              style={{ width: `${meta.pct}%` }}
            />
          </div>
        </div>
      )}

      {servico.FeedbackCliente && (
        <p className="text-xs text-slate-500 italic mb-2 truncate">"{servico.FeedbackCliente}"</p>
      )}

      {servico.DescricaoDiagnostico && (
        <div className="text-xs bg-blue-50 border border-blue-100 rounded-lg p-2 mb-3">
          <p className="font-bold text-blue-700 mb-0.5 text-[10px] uppercase tracking-wider">Diagnóstico</p>
          <p className="text-slate-700">{servico.DescricaoDiagnostico}</p>
        </div>
      )}

      {servico.intervencoes.length > 0 && (
        <div className="border-t border-slate-100 pt-3 mt-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Intervenções realizadas
          </p>
          <div className="space-y-1.5">
            {servico.intervencoes.map((i, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                  <span className="font-medium text-slate-700 truncate">{i.descricao}</span>
                  {i.pecas.length > 0 && (
                    <span className="flex items-center gap-0.5 text-blue-500">
                      <Package size={10} /> {i.pecas.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-slate-400 shrink-0 ml-2">
                  {i.tempo && <span className="flex items-center gap-0.5"><Clock size={10} />{i.tempo}m</span>}
                  <span className="font-bold text-emerald-600">€{i.preco.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock size={12} /> {tempoTotal} min
            </div>
            <div className="flex items-center gap-1 font-bold text-slate-900">
              <Euro size={13} /> {total.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
