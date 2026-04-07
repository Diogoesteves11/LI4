import { useState, useMemo } from 'react';
import { 
  CheckCircle2, Clock, User, Bike, Battery, 
  Package, ChevronDown, ChevronUp, Wrench, Loader2, AlertCircle 
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { useRepairs } from '../../context/RepairsContext';
import { useCriarAgenda } from '../../hooks/useAgenda'; // Hook que criaste

export default function Repairs() {
  const { repairs, completeIntervention } = useRepairs();
  
  // 1. Obter o ID do mecânico logado e carregar a sua agenda
  const mecanicoId = localStorage.getItem('funcionarioId'); 
  const { data: minhaAgenda, isLoading, isError } = useCriarAgenda();

  const [selectedRepairId, setSelectedRepairId] = useState(null);
  const [expandedRepairs, setExpandedRepairs] = useState(new Set());

  // 2. Filtrar reparações: Apenas as que estão no contexto E na minha agenda
  const myScheduledRepairs = useMemo(() => {
    if (!minhaAgenda || !repairs) return [];

    return repairs.filter((r) => 
      r.status === 'scheduled' && 
      minhaAgenda.some(slot => slot.servicoID === r.id)
    );
  }, [repairs, minhaAgenda]);

  const selectedRepair = myScheduledRepairs.find((r) => r.id === selectedRepairId);

  const toggleExpandRepair = (repairId) => {
    setExpandedRepairs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(repairId)) newSet.delete(repairId);
      else newSet.add(repairId);
      return newSet;
    });
  };

  const handleCompleteIntervention = (interventionId, interventionName) => {
    if (!selectedRepairId) return;
    completeIntervention(selectedRepairId, interventionId);
    toast.success(`Intervenção concluída!`, { description: interventionName });
  };

  // Helper para mostrar a hora agendada vinda da API
  const getScheduledTime = (repairId) => {
    const slot = minhaAgenda?.find(s => s.servicoID === repairId);
    return slot ? new Date(slot.dataHoraInicio).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : '--:--';
  };

  const getInterventionProgress = (interventions) => {
    if (!interventions || interventions.length === 0) return { completed: 0, total: 0, percentage: 0 };
    const completed = interventions.filter((i) => i.completed).length;
    const total = interventions.length;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  };

  if (isLoading) return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-100">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-green-600" />
        <p className="mt-4 font-bold text-slate-600">A carregar a tua agenda de hoje...</p>
      </div>
    </div>
  );

  if (isError) return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-100 p-6">
      <div className="rounded-2xl bg-white p-8 shadow-xl text-center border-2 border-red-100">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Erro de Sincronização</h2>
        <p className="text-slate-500 mt-2">Não foi possível carregar os teus agendamentos.</p>
        <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg font-bold">Tentar Novamente</button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100">
      <Toaster position="top-right" richColors />

      {/* Barra Lateral Esquerda: Minha Agenda */}
      <aside className="w-[400px] border-r-4 border-slate-300 bg-white shadow-xl flex flex-col overflow-hidden">
        <div className="border-b bg-linear-to-br from-green-50 to-white p-6">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900">
            <Wrench className="h-7 w-7 text-green-600" />
            Minha Oficina
          </h2>
          <p className="mt-1 text-slate-600 font-medium italic">
            Tens {myScheduledRepairs.length} tarefas atribuídas
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {myScheduledRepairs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
              <Clock className="mb-4 h-16 w-16 opacity-10" />
              <p className="text-lg font-bold italic">Sem agendamentos para agora</p>
            </div>
          ) : (
            myScheduledRepairs.map((repair) => {
              const progress = getInterventionProgress(repair.interventions);
              const isExpanded = expandedRepairs.has(repair.id);
              const scheduleTime = getScheduledTime(repair.id);

              return (
                <div
                  key={repair.id}
                  onClick={() => setSelectedRepairId(repair.id)}
                  className={`group relative cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 ${
                    selectedRepairId === repair.id
                      ? 'border-green-600 bg-green-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-green-300'
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-slate-900 text-white">
                        <span className="text-[10px] font-black text-green-400 leading-none mb-0.5">{scheduleTime}</span>
                        <Bike className="h-5 w-5" />
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
                      className="rounded-full p-2 hover:bg-slate-200"
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-slate-500">Cliente:</span>{' '}
                      <span className="font-semibold text-slate-900">{repair.clientName}</span>
                    </div>

                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <div className="mb-1 flex justify-between text-[10px] font-black uppercase text-slate-500">
                        <span>Progresso</span>
                        <span>{progress.percentage}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${progress.percentage === 100 ? 'bg-green-600' : 'bg-blue-600'}`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 animate-in fade-in slide-in-from-top-1">
                        {repair.interventions.map((i) => (
                          <div key={i.id} className={`flex items-center gap-2 text-xs font-medium ${i.completed ? 'text-green-600' : 'text-slate-500'}`}>
                            {i.completed ? <CheckCircle2 size={14} /> : <Clock size={14} className="opacity-50" />}
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

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
        {selectedRepair ? (
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="rounded-2xl border-0 bg-linear-to-r from-green-600 to-green-800 p-8 text-white shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    <Bike className="h-10 w-10" />
                    <div>
                      <h1 className="text-3xl font-black italic tracking-tight uppercase">Trabalho em Curso</h1>
                      <p className="text-green-100 text-lg font-bold">
                        #{selectedRepair.id} • {selectedRepair.vehicleBrand} {selectedRepair.vehicleModel}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-6 text-sm font-bold">
                    <span className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg"><User size={18}/> {selectedRepair.clientName}</span>
                    <span className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg"><Clock size={18}/> Início: {getScheduledTime(selectedRepair.id)}</span>
                  </div>
                </div>
                <span className="rounded-lg bg-white/20 px-4 py-2 font-black text-white backdrop-blur-md uppercase tracking-widest border border-white/30">
                  {selectedRepair.vehiclePlate}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-black text-slate-900">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                Tarefas do Mecânico
              </h3>

              <div className="space-y-4">
                {selectedRepair.interventions.map((intervention) => (
                  <div
                    key={intervention.id}
                    className={`flex items-center justify-between rounded-xl border-2 p-5 transition-all ${
                      intervention.completed ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-3">
                        <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-black text-white ${intervention.completed ? 'bg-green-600' : 'bg-slate-800'}`}>
                          {intervention.code}
                        </span>
                        <span className={`text-lg font-black ${intervention.completed ? 'text-green-800 line-through' : 'text-slate-900'}`}>
                          {intervention.name}
                        </span>
                      </div>
                      <div className="flex gap-4 text-xs font-bold text-slate-400 uppercase tracking-tight">
                        <span>{intervention.category}</span>
                        <span>•</span>
                        <span>{intervention.estimatedTime} min</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCompleteIntervention(intervention.id, intervention.name)}
                      disabled={intervention.completed}
                      className={`flex h-12 items-center gap-2 rounded-lg px-8 font-black transition-all active:scale-95 shadow-lg ${
                        intervention.completed
                          ? 'bg-green-100 text-green-700 opacity-50 cursor-not-allowed shadow-none'
                          : 'bg-green-600 text-white shadow-green-200 hover:bg-green-700 cursor-pointer'
                      }`}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      {intervention.completed ? 'OK' : 'Validar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
               {selectedRepair.parts?.length > 0 && (
                <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
                  <h4 className="mb-4 flex items-center gap-2 font-black text-slate-900 uppercase text-xs tracking-widest">
                    <Package className="h-4 w-4 text-blue-600" /> Peças para Aplicar
                  </h4>
                  <div className="space-y-2">
                    {selectedRepair.parts.map(p => (
                      <div key={p.ean} className="flex justify-between rounded-lg bg-slate-50 p-3 border border-slate-100 text-sm">
                        <span className="font-bold text-slate-700">{p.name}</span>
                        <span className="font-black text-blue-600">x{p.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
               )}

               {selectedRepair.notes && (
                <div className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm">
                  <h4 className="mb-4 font-black text-slate-900 uppercase text-xs tracking-widest italic">Instruções de Diagnóstico</h4>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium bg-slate-50 p-4 rounded-xl">
                    {selectedRepair.notes}
                  </p>
                </div>
               )}
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-400">
            <Wrench className="h-20 w-20 opacity-10 mb-4" />
            <p className="text-xl font-bold italic tracking-tight">Selecione uma trotinete para começar a reparação</p>
          </div>
        )}
      </main>
    </div>
  );
}