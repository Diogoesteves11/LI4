import React, { useState } from 'react';
import { Package, User, CheckCircle2, ArrowRight, Box } from 'lucide-react';

const mockReservedParts = [
  {
    id: 'P-9901',
    partName: 'Bateria Samsung 36V 12.8Ah',
    client: 'Ricardo Pereira',
    reservationDate: '2026-03-22',
    totalPaid: 189.90,
    status: 'ready',
  },
  {
    id: 'P-9902',
    partName: 'Motor 350W Xiaomi Pro 2',
    client: 'Cláudia Ramos',
    reservationDate: '2026-03-23',
    totalPaid: 124.50,
    status: 'ready',
  },
  {
    id: 'P-9903',
    partName: 'Par de Pneus Sólidos 8.5"',
    client: 'Nuno Ferreira',
    reservationDate: '2026-03-24',
    totalPaid: 45.00,
    status: 'ready',
  },
  {
    id: 'P-9904',
    partName: 'Controladora Ninebot G30D',
    client: 'Sérgio Mota',
    reservationDate: '2026-03-25',
    totalPaid: 89.00,
    status: 'ready',
  },
];

export default function PecasReservadas() {
  const [parts, setParts] = useState(mockReservedParts);
  const [confirmingId, setConfirmingId] = useState(null);

  const handleConfirmPickup = (id) => {
    // Simulação de confirmação de entrega
    setParts(
      parts.map((p) => (p.id === id ? { ...p, status: 'collected' } : p))
    );
    setConfirmingId(null);
  };

  const readyParts = parts.filter((p) => p.status === 'ready');
  const collectedToday = parts.filter((p) => p.status === 'collected');

  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-800">Peças Reservadas</h2>
        <p className="text-slate-500 font-medium">Artigos pagos e validados, aguardando levantamento em loja</p>
      </div>

      {/* KPIs de Peças */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-orange-300 transition-all">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Pendentes</p>
            <p className="text-3xl font-black text-orange-600 tabular-nums">{readyParts.length}</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
            <Package className="h-8 w-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-green-300 transition-all">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Levantadas Hoje</p>
            <p className="text-3xl font-black text-green-600 tabular-nums">{collectedToday.length}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-xl text-green-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-400 transition-all">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Valor em Stock</p>
            <p className="text-3xl font-black text-slate-800 tabular-nums">
              €{readyParts.reduce((sum, p) => sum + p.totalPaid, 0).toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Box className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Tabela de Levantamento */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-8">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Package className="h-6 w-6 text-orange-600" />
          <h3 className="text-xl font-black text-slate-800">Prontas para Entrega</h3>
        </div>

        <div className="overflow-x-auto">
          {readyParts.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Box className="h-8 w-8 text-slate-200" />
              </div>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Sem reservas pendentes</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                  <th className="px-8 py-4 border-b border-slate-100">Referência</th>
                  <th className="px-8 py-4 border-b border-slate-100">Artigo</th>
                  <th className="px-8 py-4 border-b border-slate-100">Cliente</th>
                  <th className="px-8 py-4 border-b border-slate-100 text-center">Reserva</th>
                  <th className="px-8 py-4 border-b border-slate-100">Valor</th>
                  <th className="px-8 py-4 border-b border-slate-100 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {readyParts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 font-mono text-xs font-bold text-slate-400">{p.id}</td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{p.partName}</span>
                        <span className="text-[10px] font-black text-slate-300 uppercase italic">Original Part</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                          <User size={14} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{p.client}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className="text-xs font-bold text-slate-500 tabular-nums">
                         {new Date(p.reservationDate).toLocaleDateString('pt-PT')}
                       </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-full">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
                        €{p.totalPaid.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleConfirmPickup(p.id)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-100 active:scale-95 transition-all cursor-pointer"
                      >
                        Confirmar Levantamento <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Histórico de Hoje */}
      {collectedToday.length > 0 && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-4 px-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Entregues Hoje</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collectedToday.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-green-600 border border-green-100">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{p.partName}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase truncate">Para: {p.client}</p>
                  </div>
                </div>
                <div className="text-right ml-4 shrink-0">
                   <p className="text-xs font-black text-slate-400 line-through tabular-nums">€{p.totalPaid.toFixed(2)}</p>
                   <span className="text-[8px] font-bold text-green-600 uppercase bg-green-50 px-1 rounded">Finalizado</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}