import { useState } from 'react';
import { FileDown, CalendarCheck, Clock, User, Bike, Battery } from 'lucide-react';
import { RepairList } from '../../components/RepairList';
import { InterventionSelector } from '../../components/SelecionarIntervencao';
import { EANScanner } from '../../components/EANScanner';
import { ScheduleRepairDialog } from '../../components/AgendamentoReparacao';
import { toast, Toaster } from 'sonner';
import { generateDiagnosticPDF } from '../../utils/PDFGuiaReparacao';
import { useRepairs } from '../../context/RepairsContext';

export default function Dashboard() {
  const { repairs, updateRepairStatus, addRepairDetails } = useRepairs();
  
  // Estados locais para gerir o diagnóstico atual
  const [selectedRepairId, setSelectedRepairId] = useState(repairs[0]?.id || null);
  const [selectedInterventions, setSelectedInterventions] = useState([]);
  const [parts, setParts] = useState([]);
  const [notes, setNotes] = useState('');
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  const selectedRepair = repairs.find(r => r.id === selectedRepairId);


  const handleDownloadPDF = () => {
    if (!selectedRepair) return;

    if (selectedInterventions.length === 0) {
      toast.error('Adicione pelo menos uma intervenção ao diagnóstico');
      return;
    }

    try {
      generateDiagnosticPDF(selectedRepair, selectedInterventions, parts, notes);
      
      // Atualiza o estado para "diagnosticado" no contexto global
      updateRepairStatus(selectedRepairId, 'diagnosed');

      toast.success('Guia de diagnóstico gerada com sucesso!', {
        description: 'O PDF foi descarregado para o seu dispositivo'
      });
    } catch (error) {
      toast.error('Erro ao gerar PDF');
      console.error(error);
    }
  };

  const handleScheduleRepair = (scheduleData) => {
    if (!selectedRepair) return;

    // Guarda os detalhes (intervenções, peças e notas) no contexto antes de agendar
    addRepairDetails(selectedRepairId, selectedInterventions, parts, notes);
    updateRepairStatus(selectedRepairId, 'scheduled');

    toast.success(`Reparação agendada com sucesso!`, {
      description: `${scheduleData.date} às ${scheduleData.time} - ${selectedRepair.vehiclePlate}`
    });

    setShowScheduleDialog(false);

    // Limpa o formulário local
    setSelectedInterventions([]);
    setParts([]);
    setNotes('');

    // Salta automaticamente para a próxima trotinete pendente
    const nextRepair = repairs.find(r => r.status === 'pending' && r.id !== selectedRepairId);
    if (nextRepair) {
      setSelectedRepairId(nextRepair.id);
    }
  };

  const handleOpenScheduleDialog = () => {
    if (!selectedRepair) return;
    if (selectedInterventions.length === 0) {
      toast.error('Adicione pelo menos uma intervenção antes de agendar');
      return;
    }
    setShowScheduleDialog(true);
  };

  const handleSelectRepair = (repairId) => {
    setSelectedRepairId(repairId);
    // Limpa o rascunho atual ao trocar de trotinete
    setSelectedInterventions([]);
    setParts([]);
    setNotes('');
  };

  const getBatteryColor = (level) => {
    if (level === undefined) return 'text-white/60';
    if (level <= 20) return 'text-red-400';
    if (level <= 50) return 'text-amber-400';
    return 'text-green-400';
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Toaster position="top-right" richColors />
      
      {/* Coluna Esquerda: Lista de Reparações */}
      <aside className="w-[400px] border-r-4 border-slate-300 bg-white shadow-2xl overflow-hidden flex flex-col">
        <RepairList
          repairs={repairs}
          selectedRepairId={selectedRepairId}
          onSelectRepair={handleSelectRepair}
        />
      </aside>

      {/* Área Principal: Diagnóstico Detalhado */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        {selectedRepair ? (
          <div className="mx-auto max-w-7xl p-8 space-y-8">
            
            {/* Cabeçalho de Identificação (Card Principal) */}
            <div className="overflow-hidden rounded-2xl border-0 bg-linear-to-r from-blue-600 to-blue-800 p-8 text-white shadow-2xl transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="rounded-xl bg-white/20 p-3 backdrop-blur-md">
                      <Bike className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-black tracking-tight">
                        Guia de Diagnóstico #{selectedRepair.id}
                      </h1>
                      <p className="mt-1 text-xl font-medium text-blue-100 italic">
                        {selectedRepair.vehicleBrand} {selectedRepair.vehicleModel} • {selectedRepair.vehiclePlate}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-8 text-sm">
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                      <User className="h-5 w-5 text-blue-200" />
                      <span className="font-bold">{selectedRepair.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-200" />
                      <span className="font-bold">
                        Chegada: {selectedRepair.scheduledTime}
                      </span>
                    </div>
                    {selectedRepair.batteryLevel !== undefined && (
                      <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
                        <Battery className={`h-5 w-5 ${getBatteryColor(selectedRepair.batteryLevel)}`} />
                        <span className={`font-bold ${getBatteryColor(selectedRepair.batteryLevel)}`}>
                          {selectedRepair.batteryLevel}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <span className={`rounded-xl px-6 py-3 text-sm font-black uppercase tracking-widest shadow-lg ${
                  selectedRepair.status === 'diagnosed'
                    ? 'bg-white text-blue-700'
                    : selectedRepair.status === 'scheduled'
                    ? 'bg-green-500 text-white animate-pulse'
                    : 'bg-amber-500 text-white'
                }`}>
                  {selectedRepair.status === 'pending' && 'Pendente'}
                  {selectedRepair.status === 'diagnosed' && 'Diagnosticado'}
                  {selectedRepair.status === 'scheduled' && 'Agendado'}
                </span>
              </div>
            </div>

            {/* Painel de Seleção de Intervenções */}
            <InterventionSelector
              selectedInterventions={selectedInterventions}
              onAddIntervention={(i) => setSelectedInterventions([...selectedInterventions, i])}
              onRemoveIntervention={(id) => setSelectedInterventions(selectedInterventions.filter(i => i.id !== id))}
            />

            {/* Scanner de Peças */}
            <EANScanner
              parts={parts}
              onAddPart={(part) => {
                const idx = parts.findIndex(p => p.ean === part.ean);
                if (idx >= 0) {
                  const updated = [...parts];
                  updated[idx] = part;
                  setParts(updated);
                } else {
                  setParts([...parts, part]);
                }
              }}
              onRemovePart={(ean) => {
                setParts(parts.filter(p => p.ean !== ean));
                toast.info('Peça removida');
              }}
            />

            {/* Campo de Texto para Notas Técnicas */}
            <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-slate-900">Observações do Diagnóstico</h3>
              <textarea
                placeholder="Ex: Folga excessiva no guiador, requer lubrificação nos rolamentos traseiros..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full rounded-xl border-2 border-slate-200 p-4 text-lg outline-hidden transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* Botões de Ação Final */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
              <button
                onClick={handleDownloadPDF}
                disabled={selectedInterventions.length === 0}
                className="group flex h-24 cursor-pointer items-center justify-center gap-4 rounded-2xl bg-linear-to-r from-purple-600 to-purple-800 text-2xl font-black text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileDown className="h-10 w-10 transition-transform group-hover:-translate-y-1" />
                Descarregar Guia PDF
              </button>
              
              <button
                onClick={handleOpenScheduleDialog}
                disabled={selectedInterventions.length === 0 || selectedRepair.status === 'scheduled'}
                className="group flex h-24 cursor-pointer items-center justify-center gap-4 rounded-2xl bg-linear-to-r from-green-600 to-green-700 text-2xl font-black text-white shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CalendarCheck className="h-10 w-10 transition-transform group-hover:rotate-12" />
                Agendar Reparação
              </button>
            </div>
          </div>
        ) : (
          /* Estado Vazio */
          <div className="flex h-full flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-slate-200 p-10">
              <Bike className="h-20 w-20 text-slate-400 opacity-50" />
            </div>
            <p className="text-2xl font-bold text-slate-400">Selecione uma trotinete na barra lateral</p>
          </div>
        )}
      </main>

      {/* Modal de Agendamento */}
      {selectedRepair && (
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