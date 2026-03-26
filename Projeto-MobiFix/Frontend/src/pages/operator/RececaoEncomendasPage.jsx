import React, { useState } from 'react';
import { Package, TruckIcon, CheckCircle, AlertCircle, Plus, Calendar, Minus, ChevronDown, ChevronUp } from 'lucide-react';

const mockOrders = [
  {
    id: 'PO-2026-001',
    supplier: 'Xiaomi Distributor PT',
    orderDate: '2026-03-15',
    expectedDate: '2026-03-24',
    status: 'pending',
    items: [
      { id: '1', product: 'Xiaomi Mi Pro 2', expectedQuantity: 10, receivedQuantity: 0, confirmed: false },
      { id: '2', product: 'Bateria Extra Xiaomi', expectedQuantity: 5, receivedQuantity: 0, confirmed: false },
      { id: '3', product: 'Pneu Traseiro Xiaomi', expectedQuantity: 20, receivedQuantity: 0, confirmed: false },
    ],
  },
  {
    id: 'PO-2026-002',
    supplier: 'Acessórios Pro Lda',
    orderDate: '2026-03-18',
    expectedDate: '2026-03-25',
    status: 'pending',
    items: [
      { id: '4', product: 'Capacete Urban Pro', expectedQuantity: 30, receivedQuantity: 0, confirmed: false },
      { id: '5', product: 'Luzes LED Pack', expectedQuantity: 50, receivedQuantity: 0, confirmed: false },
      { id: '6', product: 'Cadeado Anti-Furto', expectedQuantity: 25, receivedQuantity: 0, confirmed: false },
      { id: '7', product: 'Mochila Transporte', expectedQuantity: 15, receivedQuantity: 0, confirmed: false },
    ],
  },
];

export default function RececaoEncomendas() {
  const [orders, setOrders] = useState(mockOrders);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const updateReceivedQuantity = (orderId, itemId, quantity) => {
    setOrders(orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            items: order.items.map((item) =>
              item.id === itemId ? { ...item, receivedQuantity: Math.max(0, quantity) } : item
            ),
          }
        : order
    ));
  };

  // Lógica alterada: Se for o último item a ser confirmado, completa a encomenda automaticamente
  const confirmItem = (orderId, itemId) => {
    setOrders(orders.map((order) => {
      if (order.id === orderId) {
        const newItems = order.items.map((item) =>
          item.id === itemId ? { ...item, confirmed: true } : item
        );
        
        // Verifica se TODOS os itens estão confirmados agora
        const allItemsConfirmed = newItems.every(item => item.confirmed);
        
        return {
          ...order,
          items: newItems,
          status: allItemsConfirmed ? 'completed' : order.status
        };
      }
      return order;
    }));
  };

  // Lógica alterada: Força o estado 'completed' independentemente das quantidades
  const forceCompleteOrder = (orderId) => {
    setOrders(orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          items: order.items.map((item) => ({ ...item, confirmed: true })),
          status: 'completed',
        };
      }
      return order;
    }));
  };

  const getOrderProgress = (order) => {
    const totalExpected = order.items.reduce((sum, item) => sum + item.expectedQuantity, 0);
    const totalReceived = order.items.reduce((sum, item) => sum + item.receivedQuantity, 0);
    return { 
      totalExpected, 
      totalReceived, 
      percentage: totalExpected > 0 ? (totalReceived / totalExpected) * 100 : 0 
    };
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-800">Receção de Encomendas</h2>
        <p className="text-slate-500 font-medium">Controlo e conferência de mercadoria de fornecedores</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Pendentes</p>
            <p className="text-3xl font-black text-orange-600 tabular-nums">
              {orders.filter((o) => o.status !== 'completed').length}
            </p>
          </div>
          <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
            <TruckIcon className="h-8 w-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Completas</p>
            <p className="text-3xl font-black text-green-600 tabular-nums">
              {orders.filter((o) => o.status === 'completed').length}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-xl text-green-600">
            <CheckCircle className="h-8 w-8" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const progress = getOrderProgress(order);
          const isExpanded = expandedOrder === order.id;
          const isCompleted = order.status === 'completed';

          return (
            <div key={order.id} className={`bg-white rounded-2xl border transition-all ${isCompleted ? 'border-green-200 opacity-75' : 'border-slate-200 shadow-sm overflow-hidden'}`}>
              <div 
                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                className={`p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-black text-slate-800 tracking-tight">{order.id}</span>
                    <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {isCompleted ? 'Completa' : 'Pendente'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5"><TruckIcon size={14}/> {order.supplier}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(order.expectedDate).toLocaleDateString('pt-PT')}</span>
                    <span className="font-mono text-blue-600">{progress.totalReceived} / {progress.totalExpected} UN</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="p-2 rounded-lg bg-slate-100 text-slate-500">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="p-6 border-t border-slate-100 animate-in slide-in-from-top-2">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                        <th className="pb-4">Produto</th>
                        <th className="pb-4 text-center">Esperado</th>
                        <th className="pb-4 text-center">Recebido</th>
                        <th className="pb-4 text-center">Estado</th>
                        {!isCompleted && <th className="pb-4 text-right">Ação</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {order.items.map((item) => {
                        const isItemComplete = item.receivedQuantity === item.expectedQuantity;
                        const hasDiscrepancy = item.receivedQuantity > 0 && !isItemComplete;

                        return (
                          <tr key={item.id}>
                            <td className="py-4 font-bold text-slate-700 text-sm">{item.product}</td>
                            <td className="py-4 text-center font-mono text-slate-400">{item.expectedQuantity}</td>
                            <td className="py-4 px-2 text-center">
                              {!item.confirmed && !isCompleted ? (
                                <div className="flex items-center justify-center gap-2">
                                  <button onClick={() => updateReceivedQuantity(order.id, item.id, item.receivedQuantity - 1)} className="p-1 bg-slate-100 rounded hover:bg-slate-200"><Minus size={14} /></button>
                                  <input type="number" value={item.receivedQuantity} onChange={(e) => updateReceivedQuantity(order.id, item.id, parseInt(e.target.value) || 0)} className="w-12 text-center font-black text-sm bg-transparent outline-none" />
                                  <button onClick={() => updateReceivedQuantity(order.id, item.id, item.receivedQuantity + 1)} className="p-1 bg-slate-100 rounded hover:bg-slate-200"><Plus size={14} /></button>
                                </div>
                              ) : (
                                <span className="font-black text-slate-800">{item.receivedQuantity}</span>
                              )}
                            </td>
                            <td className="py-4 text-center">
                              {item.confirmed || isCompleted ? (
                                <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded tracking-tighter uppercase">✓ Confirmado</span>
                              ) : hasDiscrepancy ? (
                                <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded tracking-tighter uppercase">⚠ Discrepância</span>
                              ) : isItemComplete ? (
                                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded tracking-tighter uppercase">Pronto</span>
                              ) : (
                                <span className="text-[10px] font-black text-slate-300 uppercase italic">Aguardando</span>
                              )}
                            </td>
                            {!isCompleted && (
                              <td className="py-4 text-right">
                                <button
                                  disabled={item.confirmed}
                                  onClick={() => confirmItem(order.id, item.id)}
                                  className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg hover:bg-blue-600 disabled:opacity-0 transition-all cursor-pointer"
                                >
                                  Validar
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {!isCompleted && (
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase italic">
                        <AlertCircle size={14} />
                        Atenção: A finalização forçada ignora faltas no stock.
                      </div>
                      <button
                        onClick={() => forceCompleteOrder(order.id)}
                        className="px-8 py-4 bg-slate-900 text-white font-black uppercase text-xs tracking-widest rounded-xl shadow-xl hover:bg-green-600 transition-all cursor-pointer active:scale-95"
                      >
                        Finalizar Encomenda (Forçar)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}