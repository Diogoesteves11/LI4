import React, { useState } from 'react';
import { Bike, User, Calendar, Euro, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import Faturacao from '../../components/Faturacao';

const mockTrotinetes = [
  {
    id: 'T001',
    model: 'Xiaomi Mi Pro 2',
    client: 'João Silva',
    orderDate: '2026-03-18',
    readyDate: '2026-03-24',
    deposit: 150,
    totalAmount: 499.99,
    status: 'ready',
  },
  {
    id: 'T002',
    model: 'Ninebot Max G30',
    client: 'Maria Santos',
    orderDate: '2026-03-20',
    readyDate: '2026-03-24',
    deposit: 200,
    totalAmount: 649.99,
    status: 'ready',
  },
  {
    id: 'T003',
    model: 'Xiaomi Mi Essential',
    client: 'Pedro Costa',
    orderDate: '2026-03-15',
    readyDate: '2026-03-22',
    deposit: 100,
    totalAmount: 399.99,
    status: 'ready',
  },
];

export default function TrotinetesProntas() {
  const [trotinetes, setTrotinetes] = useState(mockTrotinetes);
  const [selectedTrotinete, setSelectedTrotinete] = useState(null);
  const [showFaturacao, setShowFaturacao] = useState(false);

  const handleDeliver = (trotinete) => {
    setSelectedTrotinete(trotinete);
    setShowFaturacao(true);
  };

  const handleFaturacaoComplete = () => {
    if (selectedTrotinete) {
      setTrotinetes(
        trotinetes.map((t) =>
          t.id === selectedTrotinete.id ? { ...t, status: 'delivered' } : t
        )
      );
    }
    setSelectedTrotinete(null);
    setShowFaturacao(false);
  };

  const readyTrotinetes = trotinetes.filter((t) => t.status === 'ready');
  const deliveredTrotinetes = trotinetes.filter((t) => t.status === 'delivered');

  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-800">Trotinetes Prontas</h2>
        <p className="text-slate-500 font-medium">Trotinetes reparadas pendentes de levantamento</p>
      </div>

      {/* Cartões de Resumo (Kpis) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-all">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Prontas</p>
            <p className="text-3xl font-black text-blue-600 tabular-nums">{readyTrotinetes.length}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Clock className="h-8 w-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-green-300 transition-all">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Entregues Hoje</p>
            <p className="text-3xl font-black text-green-600 tabular-nums">{deliveredTrotinetes.length}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-xl text-green-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-slate-400 transition-all">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Total a Receber</p>
            <p className="text-3xl font-black text-slate-800 tabular-nums">
              €{readyTrotinetes.reduce((sum, t) => sum + t.totalAmount, 0).toFixed(2)}
            </p>
          </div>
          <div className="p-3 bg-slate-100 rounded-xl text-slate-800">
            <Euro className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Tabela de Encomendas Prontas */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-8">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Bike className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-black text-slate-800">Aguardando Levantamento</h3>
        </div>

        <div className="overflow-x-auto">
          {readyTrotinetes.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bike className="h-8 w-8 text-slate-200" />
              </div>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Tudo entregue!</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                  <th className="px-8 py-4 border-b border-slate-100">ID</th>
                  <th className="px-8 py-4 border-b border-slate-100">Equipamento</th>
                  <th className="px-8 py-4 border-b border-slate-100">Cliente</th>
                  <th className="px-8 py-4 border-b border-slate-100 text-center">Data</th>
                  <th className="px-8 py-4 border-b border-slate-100 text-blue-600">Falta Pagar</th>
                  <th className="px-8 py-4 border-b border-slate-100 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {readyTrotinetes.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 font-mono text-sm font-bold text-slate-400">{t.id}</td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{t.model}</span>
                        <span className="text-[10px] font-black text-slate-300 uppercase">Trotinete Elétrica</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                          <User size={14} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{t.client}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                       <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                         {new Date(t.orderDate).toLocaleDateString('pt-PT')}
                       </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-red-600 tabular-nums">€{t.totalAmount.toFixed(2)}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleDeliver(t)}
                        className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white text-xs font-black uppercase tracking-tighter rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-100 active:scale-95 transition-all cursor-pointer"
                      >
                        Entregar <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Secção de Entregas Recentes (Entregues Hoje) */}
      {deliveredTrotinetes.length > 0 && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-4 px-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Entregues Hoje</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveredTrotinetes.map((t) => (
              <div
                key={t.id}
                className="bg-green-50/50 border border-green-100 p-4 rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{t.model}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase">{t.client}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-black text-green-700 tabular-nums">€{t.totalAmount.toFixed(2)}</p>
                   <span className="text-[8px] font-bold text-green-600 uppercase">Pago Total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integração com o Modal de Faturação */}
      {showFaturacao && selectedTrotinete && (
        <Faturacao
          amount={selectedTrotinete.totalAmount}
          items={[
            {
              id: selectedTrotinete.id,
              name: `Liquidacao: ${selectedTrotinete.model}`,
              category: 'Entrega Equipamento',
              price: selectedTrotinete.totalAmount,
              quantity: 1,
            },
          ]}
          onClose={() => {
            setSelectedTrotinete(null);
            setShowFaturacao(false);
          }}
          onComplete={handleFaturacaoComplete}
        />
      )}
    </div>
  );
}