import { useState, useMemo } from 'react';
import {
  CheckCircle2, Clock, User, Bike,
  Package, ChevronDown, ChevronUp, Wrench, Loader2, AlertCircle, Euro
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useAgendas, useAtualizarAgenda } from '../../hooks/useAgenda';
import { useServicos, useAtualizarServico } from '../../hooks/useServicos';
import { useIntervencoesCatalogo } from '../../hooks/useIntervencoesCatalogo';

// ── Extrai o claim "id" (NumeroMecanografico) do JWT ──────────────────────────
function getMecanicoIdFromToken() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload?.id ?? null;
  } catch {
    return null;
  }
}

export default function Repairs() {
  // ── Dados remotos ────────────────────────────────────────────────────────
  const { mutateAsync: atualizarAgenda } = useAtualizarAgenda();
  const { mutateAsync: atualizarServico } = useAtualizarServico();
  const { data: agendas  = [], isLoading: loadingAgendas,  isError: errorAgendas  } = useAgendas();
  const { data: servicos = [], isLoading: loadingServicos, isError: errorServicos  } = useServicos();
  const { data: catalogo = [], isLoading: loadingCatalogo                          } = useIntervencoesCatalogo();

  const mecanicoId = getMecanicoIdFromToken();

  // ── Montar lista de reparações ───────────────────────────────────────────
  // Agenda REPARACAO atribuída a este mecânico → cruza com serviço e catálogo
  const repairs = useMemo(() => {
    if (!agendas.length || !servicos.length || !catalogo.length) return [];

    return agendas
      .filter(a => a.TipoSlot === 'REPARACAO' && a.MecanicoNumero === mecanicoId && a.Estado === 'RESERVADO')
      .map(agenda => {
        const servico = servicos.find(s => s.ServicoID === agenda.ServicoID);

        // Intervenções do serviço: cada IntervencaoCatalogoID → nome/preço do catálogo
        const intervencoes = (servico?.HistoricoIntervencoes ?? []).map(hiv => {
          const cat = catalogo.find(c => c.IntervencaoID === hiv.IntervencaoCatalogoID);
          return {
            id:          hiv.IntervencaoCatalogoID,
            descricao:   cat?.Descricao          ?? `Intervenção #${hiv.IntervencaoCatalogoID}`,
            especialidade: cat?.Especialidade    ?? '—',
            preco:       cat?.PrecoFixoMaoDeObra ?? 0,
            pecas:       hiv.PecasUtilizadas     ?? [],
          };
        });

        return {
          agendaId:      agenda.AgendaID,
          servicoId:     agenda.ServicoID,
          dataHoraInicio: agenda.DataHoraInicio,
          trotineteNumSerie: servico?.TrotineteNumSerie ?? 'S/N',
          feedbackCliente:   servico?.FeedbackCliente  ?? '',
          descricaoDiagnostico: servico?.DescricaoDiagnostico ?? '',
          estado:        agenda.Estado,
          intervencoes,
        };
      });
  }, [agendas, servicos, catalogo, mecanicoId]);

  // ── Estado local de progresso (substitui o context) ──────────────────────
  // { [agendaId]: Set<intervencaoId> } — IDs de intervenções já validadas
  const [concluidas, setConcluidas] = useState({});

  const marcarConcluida = async (agendaId, intervencaoId, descricao, todasIntervencoes) => {
    // 1. Atualizar o estado local (UI)
    const novasConcluidas = new Set(concluidas[agendaId] ?? []);
    novasConcluidas.add(intervencaoId);
    
    setConcluidas(prev => ({
      ...prev,
      [agendaId]: novasConcluidas
    }));
    
    toast.success('Intervenção concluída!', { description: descricao });

    // 2. Verificar se foi a última intervenção
    if (novasConcluidas.size === todasIntervencoes.length) {
      try {
        // Encontrar os objetos originais completos para fazer o PUT
        const agendaOriginal = agendas.find(a => a.AgendaID === agendaId);
        const servicoOriginal = servicos.find(s => s.ServicoID === agendaOriginal?.ServicoID);

        if (!agendaOriginal || !servicoOriginal) {
           toast.error('Erro: Dados originais não encontrados.');
           return;
        }

        // Criar os payloads com os novos estados
        const payloadAgenda = { ...agendaOriginal, Estado: 'CONCLUIDO' };
        
        // No serviço, também atualizamos a DataConclusao se quiseres
        const payloadServico = { 
            ...servicoOriginal, 
            Estado: 'FECHADO',
            DataConclusao: new Date().toISOString()
        };

        // 3. Executar as mutações no servidor (em paralelo)
        toast.promise(
          Promise.all([
            atualizarAgenda({ id: agendaId, dados: payloadAgenda }),
            atualizarServico({ id: servicoOriginal.ServicoID, dados: payloadServico })
          ]),
          {
            loading: 'A finalizar reparação no servidor...',
            success: 'Reparação e Serviço fechados com sucesso!',
            error: 'Erro ao fechar a reparação no servidor.'
          }
        );
        
        // Opcional: Limpar a seleção para voltar ao menu principal
        // setSelectedAgendaId(null); 

      } catch (error) {
        console.error("Erro ao finalizar:", error);
      }
    }
  };

  const getProgress = (agendaId, intervencoes) => {
    if (!intervencoes.length) return { completed: 0, total: 0, pct: 0 };
    const set = concluidas[agendaId] ?? new Set();
    const completed = intervencoes.filter(i => set.has(i.id)).length;
    return { completed, total: intervencoes.length, pct: Math.round((completed / intervencoes.length) * 100) };
  };

  // ── Seleção ───────────────────────────────────────────────────────────────
  const [selectedAgendaId, setSelectedAgendaId] = useState(null);
  const [expandedIds, setExpandedIds]           = useState(new Set());

  const selectedRepair = repairs.find(r => r.agendaId === selectedAgendaId);

  const toggleExpand = (id) =>
    setExpandedIds(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  const formatHora = (iso) => {
    try { return new Date(iso).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }); }
    catch { return '--:--'; }
  };

  // ── Guards ────────────────────────────────────────────────────────────────
  const isLoading = loadingAgendas || loadingServicos || loadingCatalogo;
  const isError   = errorAgendas  || errorServicos;

  if (isLoading) return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-100">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-green-600" />
        <p className="mt-4 font-bold text-slate-600">A carregar a tua agenda...</p>
      </div>
    </div>
  );

  if (isError) return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-100 p-6">
      <div className="rounded-2xl bg-white p-8 shadow-xl text-center border-2 border-red-100">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Erro de Sincronização</h2>
        <p className="text-slate-500 mt-2">Não foi possível carregar os agendamentos.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg font-bold"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100">
      <Toaster position="top-right" richColors />

      {/* ── Sidebar ── */}
      <aside className="w-[400px] border-r-4 border-slate-300 bg-white shadow-xl flex flex-col overflow-hidden shrink-0">
        <div className="border-b bg-gradient-to-br from-green-50 to-white p-6">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
            <Wrench className="h-7 w-7 text-green-600" />
            Minha Oficina
          </h2>
          <p className="mt-1 text-slate-500 font-medium">
            {repairs.length} reparaç{repairs.length !== 1 ? 'ões' : ''} atribuída{repairs.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {repairs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
              <Clock className="mb-4 h-16 w-16 opacity-10" />
              <p className="text-lg font-bold">Sem reparações atribuídas</p>
            </div>
          ) : (
            repairs.map((repair) => {
              const prog      = getProgress(repair.agendaId, repair.intervencoes);
              const isExpanded = expandedIds.has(repair.agendaId);
              const isSelected = selectedAgendaId === repair.agendaId;
              const concluiuTudo = prog.pct === 100;

              return (
                <div
                  key={repair.agendaId}
                  onClick={() => setSelectedAgendaId(repair.agendaId)}
                  className={`cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 ${
                    isSelected
                      ? 'border-green-600 bg-green-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-green-300'
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 flex-col items-center justify-center rounded-lg text-white ${concluiuTudo ? 'bg-green-600' : 'bg-slate-900'}`}>
                        <span className="text-[10px] font-black text-green-300 leading-none mb-0.5">
                          {formatHora(repair.dataHoraInicio)}
                        </span>
                        {concluiuTudo ? <CheckCircle2 className="h-5 w-5" /> : <Bike className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="text-base font-bold text-slate-900">{repair.trotineteNumSerie}</div>
                        <div className="text-xs text-slate-500">Serviço #{repair.servicoId}</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleExpand(repair.agendaId); }}
                      className="rounded-full p-1.5 hover:bg-slate-100 text-slate-400 transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {/* Feedback cliente */}
                  {repair.feedbackCliente && (
                    <p className="text-xs text-slate-400 italic mb-3 truncate">"{repair.feedbackCliente}"</p>
                  )}

                  {/* Barra de progresso */}
                  <div>
                    <div className="mb-1 flex justify-between text-[10px] font-black uppercase text-slate-400">
                      <span>{prog.completed}/{prog.total} intervenções</span>
                      <span>{prog.pct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${concluiuTudo ? 'bg-green-600' : 'bg-blue-600'}`}
                        style={{ width: `${prog.pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Preview expandido */}
                  {isExpanded && repair.intervencoes.length > 0 && (
                    <div className="mt-3 space-y-1 border-t border-slate-100 pt-3 animate-in fade-in slide-in-from-top-1 duration-150">
                      {repair.intervencoes.map(i => {
                        const feita = (concluidas[repair.agendaId] ?? new Set()).has(i.id);
                        return (
                          <div key={i.id} className={`flex items-center gap-2 text-xs font-medium ${feita ? 'text-green-600' : 'text-slate-500'}`}>
                            {feita ? <CheckCircle2 size={12} /> : <Clock size={12} className="opacity-40" />}
                            <span className={feita ? 'line-through' : ''}>{i.descricao}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* ── Painel principal ── */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
        {selectedRepair ? (() => {
          const concluiuTudo = getProgress(selectedRepair.agendaId, selectedRepair.intervencoes).pct === 100;
          const set = concluidas[selectedRepair.agendaId] ?? new Set();
          const totalMaoDeObra = selectedRepair.intervencoes.reduce((s, i) => s + i.preco, 0);

          return (
            <div className="mx-auto max-w-4xl space-y-6">

              {/* Header */}
              <div className="rounded-2xl bg-gradient-to-r from-green-600 to-green-800 p-8 text-white shadow-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <Bike className="h-10 w-10" />
                      <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight">Trabalho em Curso</h1>
                        <p className="text-green-100 font-bold">
                          Agenda #{selectedRepair.agendaId} · Serviço #{selectedRepair.servicoId}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm font-bold mt-4">
                      <span className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                        <Bike size={15} /> {selectedRepair.trotineteNumSerie}
                      </span>
                      <span className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                        <Clock size={15} /> {formatHora(selectedRepair.dataHoraInicio)}
                      </span>
                      <span className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg">
                        <Euro size={15} /> M.O.: €{totalMaoDeObra.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {concluiuTudo && (
                    <span className="rounded-xl bg-white/20 px-4 py-2 text-sm font-black uppercase tracking-widest border border-white/30 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Concluído
                    </span>
                  )}
                </div>
              </div>

              {/* Queixa do cliente */}
              {selectedRepair.feedbackCliente && (
                <div className="rounded-xl border-2 border-amber-100 bg-amber-50 p-5">
                  <p className="text-xs font-black uppercase text-amber-600 mb-1">Queixa do Cliente</p>
                  <p className="text-slate-700 italic">"{selectedRepair.feedbackCliente}"</p>
                </div>
              )}

              {/* Diagnóstico técnico */}
              {selectedRepair.descricaoDiagnostico && (
                <div className="rounded-xl border-2 border-blue-100 bg-blue-50 p-5">
                  <p className="text-xs font-black uppercase text-blue-600 mb-1">Diagnóstico</p>
                  <p className="text-slate-700">{selectedRepair.descricaoDiagnostico}</p>
                </div>
              )}

              {/* Lista de intervenções */}
              <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-5 flex items-center gap-2 text-xl font-black text-slate-900">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  Intervenções a Realizar
                  <span className="ml-auto text-sm font-bold text-slate-400">
                    {set.size}/{selectedRepair.intervencoes.length}
                  </span>
                </h3>

                {selectedRepair.intervencoes.length === 0 ? (
                  <p className="text-center py-8 text-slate-400 text-sm">Sem intervenções registadas neste serviço.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedRepair.intervencoes.map((interv) => {
                      const feita = set.has(interv.id);
                      return (
                        <div
                          key={interv.id}
                          className={`flex items-center justify-between rounded-xl border-2 p-5 transition-all ${
                            feita ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-black text-white shrink-0 ${feita ? 'bg-green-600' : 'bg-slate-800'}`}>
                                #{interv.id}
                              </span>
                              <span className={`text-base font-black truncate ${feita ? 'text-green-800 line-through' : 'text-slate-900'}`}>
                                {interv.descricao}
                              </span>
                            </div>
                            <div className="flex gap-3 text-xs font-bold text-slate-400">
                              {interv.especialidade !== '—' && <span>{interv.especialidade}</span>}
                              <span className="text-emerald-600">€{interv.preco.toFixed(2)}</span>
                            </div>

                            {/* Peças desta intervenção */}
                            {interv.pecas.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {interv.pecas.map((p, idx) => (
                                  <span key={idx} className="flex items-center gap-1 rounded-md bg-blue-50 border border-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-600">
                                    <Package className="h-3 w-3" /> {p.PecaEAN} ×{p.Quantidade}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => marcarConcluida(
                                selectedRepair.agendaId, 
                                interv.id, 
                                interv.descricao, 
                                selectedRepair.intervencoes // Passamos o array completo
                            )}
                            disabled={feita}
                            className={`ml-4 shrink-0 flex h-11 items-center gap-2 rounded-lg px-6 font-black transition-all active:scale-95 ${
                              feita
                                ? 'bg-green-100 text-green-600 cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200 cursor-pointer'
                            }`}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            {feita ? 'Feito' : 'Validar'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Banner de conclusão */}
              {concluiuTudo && (
                <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white text-center shadow-xl animate-in fade-in duration-500">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3" />
                  <h3 className="text-2xl font-black">Reparação Concluída!</h3>
                  <p className="text-green-100 mt-1">Todas as intervenções foram validadas.</p>
                </div>
              )}

              <div className="pb-12" />
            </div>
          );
        })() : (
          <div className="flex h-full flex-col items-center justify-center text-slate-300 gap-4">
            <Wrench className="h-24 w-24 opacity-20" />
            <p className="text-xl font-bold">Selecione uma reparação na lista</p>
            <p className="text-sm text-slate-400">{repairs.length} atribuída{repairs.length !== 1 ? 's' : ''} a ti</p>
          </div>
        )}
      </main>
    </div>
  );
}