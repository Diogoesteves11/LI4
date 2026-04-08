import { useState, useMemo } from 'react';
import { FileDown, CalendarCheck, Clock, User, Bike, Battery, Loader2, AlertCircle } from 'lucide-react';
import { RepairList } from '../../components/RepairList';
import { InterventionSelector } from '../../components/SelecionarIntervencao';
import { EANScanner } from '../../components/EANScanner';
import { ScheduleRepairDialog } from '../../components/AgendamentoReparacao';
import { toast, Toaster } from 'sonner';
import { generateDiagnosticPDF } from '../../utils/PDFGuiaReparacao';
import { useAgendas, useCriarAgenda } from '../../hooks/useAgenda'; // Adicionado useCriarAgenda
import { useServicos } from '../../hooks/useServicos';

export default function Dashboard() {
  // 1. Hooks de Dados (Agendas e Serviços)
  const { data: agendas, isLoading: loadingAgendas, isError: errorAgendas } = useAgendas();
  const { data: servicos, isLoading: loadingServicos } = useServicos();
  
  // --- ADICIONADO: Hook para criar o agendamento da reparação ---
  const { mutateAsync: criarAgendamento, isPending: isSaving } = useCriarAgenda();

  // 2. Filtro e Enriquecimento de Dados
  const repairs = useMemo(() => {
    if (!agendas || !servicos) return [];

    return agendas
      .filter(agenda => 
        agenda.TipoSlot === "DIAGNOSTICO" && 
        agenda.Estado === "RESERVADO"
      )
      .map(agenda => {
        const servicoInfo = servicos.find(s => s.ServicoID === agenda.ServicoID);

        return {
          id: agenda.AgendaID,
          servicoId: agenda.ServicoID,
          mecanico: agenda.MecanicoNumero,
          vehiclePlate: servicoInfo?.TrotineteNumSerie || "S/ N/Serie",
          vehicleBrand: "Trotinete",
          vehicleModel: servicoInfo?.TrotineteNumSerie || "Modelo",
          clientName: servicoInfo?.FeedbackCliente || "Cliente Pendente",
          status: agenda.Estado.toLowerCase(),
          scheduledTime: new Date(agenda.DataHoraInicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          batteryLevel: 100,
          description: servicoInfo?.DescricaoDiagnostico || ""
        };
      });
  }, [agendas, servicos]);

  const [selectedRepairId, setSelectedRepairId] = useState(null);
  const [selectedInterventions, setSelectedInterventions] = useState([]);
  const [parts, setParts] = useState([]);
  const [notes, setNotes] = useState('');
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  const selectedRepair = repairs.find(r => r.id === selectedRepairId);

  // --- ADICIONADO: Handler para o agendamento ---
  const handleScheduleRepair = async (scheduleData) => {
    if (!selectedRepair) return;

    const payload = {
      mecanicoId: scheduleData.mecanicoId,
      servicoId: selectedRepair.servicoId, // Usamos o ID do serviço original
      dataHoraInicio: `${scheduleData.date}T${scheduleData.time}:00`,
    };

    try {
      await criarAgendamento(payload);
      toast.success(`Reparação agendada com sucesso!`);
      setShowScheduleDialog(false);
      limparFormulario();
      setSelectedRepairId(null); // Volta para a lista
    } catch (error) {
      toast.error('Erro ao gravar agendamento no servidor');
    }
  };

  const limparFormulario = () => {
    setSelectedInterventions([]);
    setParts([]);
    setNotes('');
  };

  if (loadingAgendas || loadingServicos) return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      <span className="ml-3 text-xl font-bold">A carregar diagnósticos agendados...</span>
    </div>
  );

  if (errorAgendas) return (
    <div className="flex h-screen items-center justify-center bg-slate-100 text-red-600">
      <AlertCircle className="h-12 w-12" />
      <span className="ml-3 text-xl font-bold">Erro ao carregar a agenda de mecânicos.</span>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100">
      <Toaster position="top-right" richColors />
      
      <aside className="w-[400px] border-r-4 border-slate-300 bg-white shadow-2xl overflow-hidden flex flex-col">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h2 className="text-lg font-black text-slate-700 uppercase tracking-wider">Fila de Diagnóstico</h2>
          <p className="text-xs text-slate-500 font-bold">Apenas Reservados / Diagnóstico</p>
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

      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        {selectedRepair ? (
          <div className="mx-auto max-w-7xl p-8 space-y-8">
            <div className="overflow-hidden rounded-2xl border-0 bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white shadow-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="rounded-xl bg-white/20 p-3 backdrop-blur-md">
                      <Bike className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-black tracking-tight">Diagnóstico Agenda #{selectedRepair.id}</h1>
                      <p className="mt-1 text-xl font-medium text-blue-100 italic">
                        Serviço ID: {selectedRepair.servicoId} • Mecânico: {selectedRepair.mecanico}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-8 text-sm font-bold">
                    <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                      <User className="h-5 w-5" /> {selectedRepair.clientName}
                    </span>
                    <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                      <Clock className="h-5 w-5" /> Início: {selectedRepair.scheduledTime}
                    </span>
                  </div>
                </div>
                <span className="rounded-xl px-6 py-3 text-sm font-black uppercase tracking-widest bg-amber-500 text-white shadow-lg">
                  {selectedRepair.status}
                </span>
              </div>
            </div>

            <InterventionSelector
              selectedInterventions={selectedInterventions}
              onAddIntervention={(i) => setSelectedInterventions([...selectedInterventions, i])}
              onRemoveIntervention={(id) => setSelectedInterventions(selectedInterventions.filter(i => i.id !== id))}
            />

            <EANScanner
              parts={parts}
              onAddPart={(part) => {
                const idx = parts.findIndex(p => p.ean === part.ean);
                setParts(idx >= 0 ? parts.map((p, i) => i === idx ? part : p) : [...parts, part]);
              }}
              onRemovePart={(ean) => setParts(parts.filter(p => p.ean !== ean))}
            />

            <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-slate-900">Observações Técnicas</h3>
              <textarea
                placeholder="Detalhes sobre a avaria..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full rounded-xl border-2 border-slate-200 p-4 text-lg focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
              <button
                onClick={() => {
                   generateDiagnosticPDF(selectedRepair, selectedInterventions, parts, notes);
                   toast.success('Guia PDF gerada!');
                }}
                disabled={selectedInterventions.length === 0}
                className="group flex h-24 items-center justify-center gap-4 rounded-2xl bg-linear-to-r from-purple-600 to-purple-800 text-2xl font-black text-white shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                <FileDown className="h-10 w-10" />
                Gerar Guia PDF
              </button>
              
              <button
                onClick={() => setShowScheduleDialog(true)}
                disabled={selectedInterventions.length === 0 || isSaving}
                className="group flex h-24 items-center justify-center gap-4 rounded-2xl bg-linear-to-r from-green-600 to-green-700 text-2xl font-black text-white shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSaving ? <Loader2 className="h-10 w-10 animate-spin" /> : <CalendarCheck className="h-10 w-10" />}
                {isSaving ? 'A guardar...' : 'Agendar Reparação'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-400">
            <CalendarCheck className="h-20 w-20 opacity-20 mb-4" />
            <p className="text-2xl font-bold">Selecione um diagnóstico reservado</p>
          </div>
        )}
      </main>

      {showScheduleDialog && (
        <ScheduleRepairDialog
          open={showScheduleDialog}
          onOpenChange={setShowScheduleDialog}
          repair={selectedRepair}
          interventions={selectedInterventions}
          parts={parts}
          onConfirmSchedule={handleScheduleRepair} // Conectado à nova função
        />
      )}
    </div>
  );
}