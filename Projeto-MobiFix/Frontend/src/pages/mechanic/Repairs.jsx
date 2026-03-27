import { useState } from 'react';
import { CheckCircle2, Clock, User, Bike, Battery, Package, ChevronDown, ChevronUp, Wrench } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useRepairs } from '../../context/RepairsContext';

export default function Repairs() {
  const { repairs, completeIntervention } = useRepairs();
  const [selectedRepairId, setSelectedRepairId] = useState(null);
  const [expandedRepairs, setExpandedRepairs] = useState(new Set());

  // Filtramos apenas o que já foi agendado e tem trabalho para fazer
  const scheduledRepairs = repairs.filter(
    (r) => r.status === 'scheduled' && r.interventions && r.interventions.length > 0
  );

  const selectedRepair = scheduledRepairs.find((r) => r.id === selectedRepairId);

  const toggleExpandRepair = (repairId) => {
    setExpandedRepairs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(repairId)) {
        newSet.delete(repairId);
      } else {
        newSet.add(repairId);
      }
      return newSet;
    });
  };

  const handleCompleteIntervention = (interventionId, interventionName) => {
    if (!selectedRepairId) return;

    completeIntervention(selectedRepairId, interventionId);
    toast.success(`Intervenção concluída!`, {
      description: interventionName,
    });
  };

  const getBatteryColor = (level) => {
    if (!level && level !== 0) return 'text-slate-400';
    if (level <= 20) return 'text-red-500';
    if (level <= 50) return 'text-amber-500';
    return 'text-green-500';
  };

  const getInterventionProgress = (interventions) => {
    if (!interventions || interventions.length === 0) return { completed: 0, total: 0, percentage: 0 };
    const completed = interventions.filter((i) => i.completed).length;
    const total = interventions.length;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  };

  return (
    <div className="flex h-screen bg-slate-100">
      <Toaster position="top-right" richColors />

      {/* Barra Lateral Esquerda: Lista de Reparações em Curso */}
      <aside className="w-[400px] border-r-4 border-slate-300 bg-white shadow-xl flex flex-col overflow-hidden">
        <div className="border-b bg-linear-to-br from-slate-50 to-slate-100 p-6">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
            <Wrench className="h-7 w-7 text-green-600" />
            Em Oficina
          </h2>
          <p className="mt-1 text-slate-600 font-medium">
            {scheduledRepairs.length} reparações ativas
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {scheduledRepairs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
              <Bike className="mb-4 h-16 w-16 opacity-20" />
              <p className="text-lg font-bold">Oficina Vazia</p>
              <p className="text-sm">Agende diagnósticos para começar.</p>
            </div>
          ) : (
            scheduledRepairs.map((repair) => {
              const progress = getInterventionProgress(repair.interventions);
              const isExpanded = expandedRepairs.has(repair.id);

              return (
                <div
                  key={repair.id}
                  onClick={() => setSelectedRepairId(repair.id)}
                  className={`group relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 ${
                    selectedRepairId === repair.id
                      ? 'border-green-600 bg-green-50/50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-green-300'
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900 font-bold text-white">
                        <Bike className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-900">{repair.vehiclePlate}</div>
                        <div className="text-sm text-slate-600">{repair.vehicleBrand} {repair.vehicleModel}</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpandRepair(repair.id);
                      }}
                      className="rounded-full p-2 hover:bg-slate-200 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-slate-500">Cliente:</span>{' '}
                      <span className="font-semibold text-slate-900">{repair.clientName}</span>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <div className="mb-1 flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <span>Estado das Tarefas</span>
                        <span>{progress.percentage}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            progress.percentage === 100 ? 'bg-green-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Lista Curta Expandida */}
                    {isExpanded && (
                      <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 animate-in fade-in slide-in-from-top-1">
                        {repair.interventions.map((i) => (
                          <div
                            key={i.id}
                            className={`flex items-center gap-2 text-xs font-medium ${
                              i.completed ? 'text-green-600' : 'text-slate-500'
                            }`}
                          >
                            {i.completed ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <Clock className="h-3.5 w-3.5 opacity-50" />
                            )}
                            <span className={i.completed ? 'line-through' : ''}>{i.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* Conteúdo Principal: Execução da Reparação */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
        {selectedRepair ? (
          <div className="mx-auto max-w-5xl space-y-6">
            
            {/* Cabeçalho do Equipamento */}
            <div className="rounded-2xl border-0 bg-linear-to-r from-green-600 to-green-800 p-8 text-white shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <Bike className="h-10 w-10" />
                    <div>
                      <h1 className="text-3xl font-black italic tracking-tight">REPARAÇÃO EM CURSO</h1>
                      <p className="text-green-100 text-lg">
                        #{selectedRepair.id} • {selectedRepair.vehicleBrand} {selectedRepair.vehicleModel}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-6 text-sm">
                    <span className="flex items-center gap-2 font-bold"><User className="h-5 w-5" /> {selectedRepair.clientName}</span>
                    <span className="flex items-center gap-2 font-bold"><Battery className="h-5 w-5" /> {selectedRepair.batteryLevel}%</span>
                  </div>
                </div>
                <span className="rounded-lg bg-white/20 px-4 py-2 font-black text-white backdrop-blur-md uppercase tracking-widest border border-white/30">
                  Matrícula: {selectedRepair.vehiclePlate}
                </span>
              </div>
            </div>

            {/* Lista de Intervenções ( Checklist do Mecânico ) */}
            <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-900">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                Plano de Trabalho
              </h3>

              <div className="space-y-4">
                {selectedRepair.interventions.map((intervention) => (
                  <div
                    key={intervention.id}
                    className={`flex items-center justify-between rounded-xl border-2 p-5 transition-all ${
                      intervention.completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-3">
                        <span className={`rounded px-2 py-0.5 font-mono text-xs font-bold text-white ${
                          intervention.completed ? 'bg-green-600' : 'bg-slate-800'
                        }`}>
                          {intervention.code}
                        </span>
                        <span className={`text-lg font-bold ${
                          intervention.completed ? 'text-green-800 line-through' : 'text-slate-900'
                        }`}>
                          {intervention.name}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm font-medium text-slate-500">
                        <span>{intervention.category}</span>
                        <span>•</span>
                        <span>Tempo: {intervention.estimatedTime} min</span>
                        {intervention.requiresParts && (
                          <span className="text-amber-600 flex items-center gap-1 font-bold">
                            <Package className="h-4 w-4" /> Requer Peças
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCompleteIntervention(intervention.id, intervention.name)}
                      disabled={intervention.completed}
                      className={`flex h-12 items-center gap-2 rounded-lg px-8 font-black transition-all active:scale-95 ${
                        intervention.completed
                          ? 'bg-green-100 text-green-700 opacity-70 cursor-not-allowed'
                          : 'bg-green-600 text-white shadow-lg shadow-green-200 hover:bg-green-700 cursor-pointer'
                      }`}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      {intervention.completed ? 'Concluído' : 'Validar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Peças e Notas (Visualização) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Listagem de Peças */}
               {selectedRepair.parts?.length > 0 && (
                <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
                  <h4 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                    <Package className="h-5 w-5 text-blue-600" /> Peças Reservadas
                  </h4>
                  <div className="space-y-2">
                    {selectedRepair.parts.map(p => (
                      <div key={p.ean} className="flex justify-between rounded-lg bg-slate-50 p-3 border border-slate-100">
                        <span className="font-semibold text-slate-700">{p.name}</span>
                        <span className="font-bold text-blue-600">x{p.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
               )}

               {/* Notas do Diagnóstico */}
               {selectedRepair.notes && (
                <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
                  <h4 className="mb-4 font-bold text-slate-900 italic underline">Observações Técnicas</h4>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedRepair.notes}
                  </p>
                </div>
               )}
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-400">
            <Wrench className="h-20 w-20 opacity-20 mb-4" />
            <p className="text-xl font-bold">Inicie um trabalho na barra lateral</p>
          </div>
        )}
      </main>
    </div>
  );
}