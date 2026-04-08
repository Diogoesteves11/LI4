import { useState } from 'react';
import { FileDown, CalendarCheck, Clock, User, Bike, Battery, Loader2 } from 'lucide-react';
import { RepairList } from '../../components/RepairList';
import { InterventionSelector } from '../../components/SelecionarIntervencao';
import { EANScanner } from '../../components/EANScanner';
import { ScheduleRepairDialog } from '../../components/AgendamentoReparacao';
import { toast, Toaster } from 'sonner';
import { generateDiagnosticPDF } from '../../utils/PDFGuiaReparacao';
import { useRepairs } from '../../context/RepairsContext';
import { useCriarAgenda } from '../../hooks/useAgenda'; 

export default function Dashboard() {
  const { repairs, updateRepairStatus, addRepairDetails } = useRepairs();
  
  // 1. Inicializar a Mutação
  const { mutateAsync: criarAgendamento, isLoading: isSaving } = useCriarAgenda();

  const [selectedRepairId, setSelectedRepairId] = useState(repairs[0]?.id || null);
  const [selectedInterventions, setSelectedInterventions] = useState([]);
  const [parts, setParts] = useState([]);
  const [notes, setNotes] = useState('');
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  const selectedRepair = repairs.find(r => r.id === selectedRepairId);

  // 2. Lógica de Agendamento com Integração API
  const handleScheduleRepair = async (scheduleData) => {
    if (!selectedRepair) return;

    // Criar o payload para a tabela AgendaMecanicos do SQL
    const payload = {
      mecanicoId: scheduleData.mecanicoId, // Vem do modal
      servicoId: selectedRepair.id,
      tipoSlot: 'Reparacao',
      dataHoraInicio: `${scheduleData.date}T${scheduleData.time}:00`,
      estado: 'Reservado',
      // Se a tua API suportar passar a intervenção principal aqui:
      intervencaoId: selectedInterventions[0]?.id 
    };

    try {
      // Chamada real para o Servidor/SQL
      await criarAgendamento(payload);

      // Se correu bem, atualizamos o estado local do contexto
      addRepairDetails(selectedRepairId, selectedInterventions, parts, notes);
      updateRepairStatus(selectedRepairId, 'scheduled');

      toast.success(`Reparação agendada no sistema!`, {
        description: `${scheduleData.date} às ${scheduleData.time} - Mecânico ID: ${scheduleData.mecanicoId}`
      });

      setShowScheduleDialog(false);
      limparFormulario();

      // Salta para a próxima trotinete
      const nextRepair = repairs.find(r => r.status === 'pending' && r.id !== selectedRepairId);
      if (nextRepair) setSelectedRepairId(nextRepair.id);

    } catch (error) {
      toast.error('Erro ao gravar agendamento na base de dados', {
        description: error.response?.data?.message || 'Tenta novamente mais tarde.'
      });
    }
  };

  const limparFormulario = () => {
    setSelectedInterventions([]);
    setParts([]);
    setNotes('');
  };

  const handleDownloadPDF = () => {
    if (!selectedRepair || selectedInterventions.length === 0) {
      toast.error('Dados insuficientes para gerar PDF');
      return;
    }
    generateDiagnosticPDF(selectedRepair, selectedInterventions, parts, notes);
    updateRepairStatus(selectedRepairId, 'diagnosed');
    toast.success('Guia PDF gerada!');
  };

  const handleOpenScheduleDialog = () => {
    if (!selectedRepair) return;
    if (selectedInterventions.length === 0) {
      toast.error('Adicione intervenções antes de agendar');
      return;
    }
    setShowScheduleDialog(true);
  };

  const handleSelectRepair = (repairId) => {
    setSelectedRepairId(repairId);
    limparFormulario();
  };

  const getBatteryColor = (level) => {
    if (level <= 20) return 'text-red-400';
    if (level <= 50) return 'text-amber-400';
    return 'text-green-400';
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Toaster position="top-right" richColors />
      
      <aside className="w-[400px] border-r-4 border-slate-300 bg-white shadow-2xl overflow-hidden flex flex-col">
        <RepairList
          repairs={repairs}
          selectedRepairId={selectedRepairId}
          onSelectRepair={handleSelectRepair}
        />
      </aside>

      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        {selectedRepair ? (
          <div className="mx-auto max-w-7xl p-8 space-y-8">
            {/* Header Card */}
            <div className="overflow-hidden rounded-2xl border-0 bg-linear-to-r from-blue-600 to-blue-800 p-8 text-white shadow-2xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="rounded-xl bg-white/20 p-3 backdrop-blur-md">
                      <Bike className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-black tracking-tight">Diagnóstico #{selectedRepair.id}</h1>
                      <p className="mt-1 text-xl font-medium text-blue-100 italic">
                        {selectedRepair.vehicleBrand} {selectedRepair.vehicleModel} • {selectedRepair.vehiclePlate}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-8 text-sm font-bold">
                    <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                      <User className="h-5 w-5" /> {selectedRepair.clientName}
                    </span>
                    <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                      <Clock className="h-5 w-5" /> Chegada: {selectedRepair.scheduledTime}
                    </span>
                    <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                      <Battery className={`h-5 w-5 ${getBatteryColor(selectedRepair.batteryLevel)}`} />
                      <span className={getBatteryColor(selectedRepair.batteryLevel)}>{selectedRepair.batteryLevel}%</span>
                    </span>
                  </div>
                </div>

                <span className={`rounded-xl px-6 py-3 text-sm font-black uppercase tracking-widest shadow-lg ${
                  selectedRepair.status === 'scheduled' ? 'bg-green-500 text-white animate-pulse' : 'bg-amber-500 text-white'
                }`}>
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
                onClick={handleDownloadPDF}
                disabled={selectedInterventions.length === 0}
                className="group flex h-24 items-center justify-center gap-4 rounded-2xl bg-linear-to-r from-purple-600 to-purple-800 text-2xl font-black text-white shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                <FileDown className="h-10 w-10 group-hover:-translate-y-1 transition-transform" />
                Gerar Guia PDF
              </button>
              
              <button
                onClick={handleOpenScheduleDialog}
                disabled={selectedInterventions.length === 0 || selectedRepair.status === 'scheduled' || isSaving}
                className="group flex h-24 items-center justify-center gap-4 rounded-2xl bg-linear-to-r from-green-600 to-green-700 text-2xl font-black text-white shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSaving ? (
                  <Loader2 className="h-10 w-10 animate-spin" />
                ) : (
                  <CalendarCheck className="h-10 w-10 group-hover:rotate-12 transition-transform" />
                )}
                {isSaving ? 'A guardar...' : 'Agendar Reparação'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-400">
            <Bike className="h-20 w-20 opacity-20 mb-4" />
            <p className="text-2xl font-bold">Selecione uma entrada na lista</p>
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
          onConfirmSchedule={handleScheduleRepair}
        />
      )}
    </div>
  );
}