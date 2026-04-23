import { useState, useMemo } from 'react';
import {
  FileDown, CalendarCheck, Clock, User, Bike,
  Loader2, AlertCircle, Hash, ShieldCheck, Euro
} from 'lucide-react';
import { RepairList } from '../../components/RepairList';
import { InterventionSelector } from '../../components/SelecionarIntervencao';
import { EANScanner } from '../../components/EANScanner';
import { ScheduleRepairDialog } from '../../components/AgendamentoReparacao';
import { toast, Toaster } from 'sonner';
import { generateDiagnosticPDF } from '../../utils/PDFGuiaReparacao';
import { useAgendas, useCriarAgenda, useAtualizarAgenda } from '../../hooks/useAgenda';
import { useServicos, useAtualizarServico } from '../../hooks/useServicos';
import { useBuscarTrotinete } from '../../hooks/useTrotinetes';

export default function Dashboard() {
  // ── Dados remotos ──────────────────────────────────────────────────────────
  const { data: agendas,  isLoading: loadingAgendas,  isError: errorAgendas  } = useAgendas();
  const { data: servicos, isLoading: loadingServicos                          } = useServicos();
  const { mutateAsync: criarAgendamento, isPending: isSaving } = useCriarAgenda();
  const { mutateAsync: atualizarAgendamento } = useAtualizarAgenda();
  const { mutateAsync: atualizarServico } = useAtualizarServico();

  // ── Lista de diagnósticos reservados ───────────────────────────────────────
  const repairs = useMemo(() => {
    if (!agendas || !servicos) return [];
    return agendas
      .filter(a => a.TipoSlot === 'DIAGNOSTICO' && a.Estado === 'RESERVADO')
      .map(a => {
        const s = servicos.find(sv => sv.ServicoID === a.ServicoID);
        return {
          id:            a.AgendaID,
          servicoId:     a.ServicoID,
          vehiclePlate:  s?.TrotineteNumSerie   || 'S/N',
          clientName:    s?.FeedbackCliente     || 'Cliente Registado',
          status:        a.Estado,
          scheduledTime: new Date(a.DataHoraInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description:   s?.DescricaoDiagnostico || '',
        };
      });
  }, [agendas, servicos]);

  // ── Reparação selecionada ──────────────────────────────────────────────────
  const [selectedRepairId, setSelectedRepairId] = useState(null);
  const selectedRepair = repairs.find(r => r.id === selectedRepairId);

  const { data: trotineteInfo } = useBuscarTrotinete(
    selectedRepair?.vehiclePlate !== 'S/N' ? selectedRepair?.vehiclePlate : null
  );

  const displayData = {
    ...selectedRepair,
    vehicleBrand: trotineteInfo?.Marca    || '—',
    vehicleModel: trotineteInfo?.Modelo   || '—',
    clientNif:    trotineteInfo?.ClienteId || 'N/A',
    emServico:    trotineteInfo?.EmServico,
  };

  // ── Estado do formulário ───────────────────────────────────────────────────
  const [selectedInterventions, setSelectedInterventions] = useState([]);
  const [parts, setParts]                                 = useState([]);
  const [notes, setNotes]                                 = useState('');
  const [showScheduleDialog, setShowScheduleDialog]       = useState(false);

  const limparFormulario = () => {
    setSelectedInterventions([]);
    setParts([]);
    setNotes('');
  };

  // Totais para feedback visual
  const totalMaoDeObra = selectedInterventions.reduce((s, i) => s + (i.PrecoFixoMaoDeObra ?? 0), 0);
  const totalPecas     = parts.reduce((s, p) => s + (p.PVP ?? 0) * p.StockAtual, 0);

  // ── Agendar Reparação — cria agenda do tipo REPARACAO ─────────────────────
  const handleScheduleRepair = async (scheduleData) => {
    if (!selectedRepair) return;

    const agendaOriginal = agendas.find(a => a.AgendaID === selectedRepair.id);
    
    const payloadUpdate = {
      ...agendaOriginal,
      Estado: 'CONCLUIDO' // O filtro no useMemo removerá este item automaticamente
    };

    const payloadNovo = {
      servicoID: selectedRepair.servicoId,
      dataHoraInicio: `${scheduleData.date}T${scheduleData.time}:00`,
      tipoSlot: 'REPARACAO',
      mecanicoNumero: agendaOriginal?.MecanicoNumero ?? '',
    };

    const pecasPayload = parts.map(p => ({
      PecaEAN: p.CodigoEAN,
      Quantidade: p.StockAtual ?? 1,
    }));

    const historicoIntervencoes = selectedInterventions.map((i, idx) => ({
      IntervencaoCatalogoID: i.IntervencaoID,
      MecanicoNumero: agendaOriginal?.MecanicoNumero ?? '',
      PecasUtilizadas: idx === 0 ? pecasPayload : [],
    }));

    const servicoPayload = {
      DescricaoDiagnostico: notes,
      HistoricoIntervencoes: historicoIntervencoes,
    };

    try {
      await atualizarAgendamento({ id: selectedRepair.id, dados: payloadUpdate });
      await atualizarServico({ id: selectedRepair.servicoId, dados: servicoPayload });
      await criarAgendamento(payloadNovo);

      toast.success('Reparação agendada e diagnóstico concluído!');
      setShowScheduleDialog(false);
      limparFormulario();
      setSelectedRepairId(null);
    } catch (error) {
      toast.error('Erro ao processar agendamento.');
    }
  };

  // ── Guards ─────────────────────────────────────────────────────────────────
  if (loadingAgendas || loadingServicos) return (
    <div className="flex h-screen items-center justify-center bg-slate-100 gap-3">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      <span className="text-xl font-bold text-slate-700">A carregar dados do sistema...</span>
    </div>
  );

  if (errorAgendas) return (
    <div className="flex h-screen items-center justify-center bg-slate-100 text-red-600 gap-3">
      <AlertCircle className="h-10 w-10" />
      <span className="text-xl font-bold">Erro ao carregar a agenda.</span>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100">
      <Toaster position="top-center" richColors />


      {/* ── Sidebar ── */}
      <aside className="w-[380px] border-r-4 border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col shrink-0">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h2 className="text-lg font-black text-slate-700 uppercase tracking-wider">Fila de Diagnóstico</h2>
          <p className="text-xs text-slate-500 font-bold">Reservados · Aguardam diagnóstico</p>
        </div>
        <RepairList
          repairs={repairs}
          selectedRepairId={selectedRepairId}
          onSelectRepair={(id) => {
            setSelectedRepairId(id);
            limparFormulario();
          }}
        />
      </aside>

      {/* ── Painel principal ── */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        {selectedRepair ? (
          <div className="mx-auto max-w-5xl p-8 space-y-8">

            {/* Header da trotinete */}
            <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white shadow-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="rounded-xl bg-white/20 p-3 backdrop-blur-md">
                      <Bike className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-black tracking-tight">
                        {displayData.vehicleBrand} {displayData.vehicleModel}
                      </h1>
                      <p className="mt-1 text-lg font-medium text-blue-100 italic">
                        S/N: {displayData.vehiclePlate} · Agenda #{displayData.id}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm font-bold">
                    <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                      <User className="h-4 w-4 text-blue-200" /> {displayData.clientName}
                    </span>
                    <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-200" /> {displayData.scheduledTime}
                    </span>
                    {displayData.emServico && (
                      <span className="flex items-center gap-2 bg-green-500/30 text-green-200 px-3 py-1.5 rounded-lg border border-green-500/50">
                        <ShieldCheck className="h-4 w-4" /> Em Manutenção
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                  <span className="rounded-xl px-5 py-2 text-sm font-black uppercase tracking-widest bg-amber-500 text-white shadow-lg">
                    {displayData.status}
                  </span>
                  <p className="text-xs font-bold text-blue-200">Serviço #{displayData.servicoId}</p>
                </div>
              </div>
            </div>

            {/* Seletor de intervenções — dados reais da API */}
            <InterventionSelector
              selectedInterventions={selectedInterventions}
              onAddIntervention={(i) => {
                if (!selectedInterventions.find(s => s.IntervencaoID === i.IntervencaoID))
                  setSelectedInterventions(prev => [...prev, i]);
              }}
              onRemoveIntervention={(id) =>
                setSelectedInterventions(prev => prev.filter(i => i.IntervencaoID !== id))
              }
            />

            {/* Scanner EAN — peças reais da API */}
            <EANScanner
              parts={parts}
              onAddPart={(part) => {
                setParts(prev => {
                  const idx = prev.findIndex(p => p.CodigoEAN === part.CodigoEAN);
                  return idx >= 0
                    ? prev.map((p, i) => i === idx ? part : p)
                    : [...prev, part];
                });
              }}
              onRemovePart={(ean) => setParts(prev => prev.filter(p => p.CodigoEAN !== ean))}
            />

            {/* Relatório de diagnóstico */}
            <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-slate-900">Relatório de Diagnóstico</h3>
              {displayData.description && (
                <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs font-bold text-amber-700 uppercase mb-1">Queixa do Cliente:</p>
                  <p className="text-slate-700 italic">"{displayData.description}"</p>
                </div>
              )}
              <textarea
                placeholder="Escreva aqui o diagnóstico técnico detalhado..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full rounded-xl border-2 border-slate-200 p-4 text-base focus:border-blue-500 outline-none transition-all resize-none"
              />
            </div>

            {/* Resumo de custos */}
            {(selectedInterventions.length > 0 || parts.length > 0) && (
              <div className="rounded-2xl border-2 border-emerald-100 bg-emerald-50 p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-emerald-700">Mão de obra: €{totalMaoDeObra.toFixed(2)}</p>
                  <p className="text-sm font-bold text-emerald-700">Peças: €{totalPecas.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Total estimado</p>
                  <p className="text-3xl font-black text-emerald-700 flex items-center gap-1">
                    <Euro className="h-6 w-6" />{(totalMaoDeObra + totalPecas).toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
              <button
                onClick={() => {
                  generateDiagnosticPDF(displayData, selectedInterventions, parts, notes);
                  toast.success('Guia PDF gerada!');
                }}
                disabled={selectedInterventions.length === 0}
                className="group flex h-24 items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-800 text-2xl font-black text-white shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
              >
                <FileDown className="h-9 w-9" />
                Gerar Guia PDF
              </button>

              <button
                onClick={() => setShowScheduleDialog(true)}
                disabled={selectedInterventions.length === 0 || isSaving}
                className="group flex h-24 items-center justify-center gap-4 rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-2xl font-black text-white shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
              >
                {isSaving
                  ? <Loader2 className="h-9 w-9 animate-spin" />
                  : <CalendarCheck className="h-9 w-9" />}
                {isSaving ? 'A guardar...' : 'Agendar Reparação'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-300 gap-4">
            <CalendarCheck className="h-24 w-24 opacity-30" />
            <p className="text-2xl font-bold">Selecione um diagnóstico na fila</p>
            <p className="text-sm font-medium text-slate-400">{repairs.length} aguardam diagnóstico</p>
          </div>
        )}
      </main>

      {showScheduleDialog && (
        <ScheduleRepairDialog
          open={showScheduleDialog}
          onOpenChange={setShowScheduleDialog}
          repair={displayData}
          interventions={selectedInterventions}
          parts={parts}
          onConfirmSchedule={handleScheduleRepair}
        />
      )}
    </div>
  );
}