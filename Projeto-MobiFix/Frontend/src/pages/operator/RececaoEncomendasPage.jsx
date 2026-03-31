import React, { useState, useMemo } from 'react';
import { 
  Package, TruckIcon, CheckCircle, AlertCircle, Plus, 
  Calendar, Minus, ChevronDown, ChevronUp, Loader2 
} from 'lucide-react';
import { useEncomendaStock } from '../../hooks/useEncomendas';

export default function RececaoEncomendas() {
  // 1. Hook Real
  const { data: apiOrders, isLoading, isError } = useEncomendaStock();
  
  // Estado local para gerir as edições de quantidade antes de enviar para o servidor
  const [localQuantities, setLocalQuantities] = useState({}); 
  const [expandedOrder, setExpandedOrder] = useState(null);

  // 2. Mapeamento e Agrupamento
  // Nota: Como a tua tabela EncomendasStock é uma linha por peça, 
  // aqui agrupamos por ID ou tratamos individualmente. 
  // Vou assumir que o serviço já devolve os dados formatados ou tratamos como lista única.
  const orders = useMemo(() => {
    if (!apiOrders) return [];
    return apiOrders;
  }, [apiOrders]);

  const updateQuantity = (orderId, value) => {
    setLocalQuantities(prev => ({
      ...prev,
      [orderId]: Math.max(0, value)
    }));
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <Loader2 className="animate-spin text-blue-600 mb-2" />
      <p className="text-slate-500 font-medium">A carregar encomendas...</p>
    </div>
  );

  if (isError) return (
    <div className="p-6 text-red-500 bg-red-50 rounded-xl flex items-center gap-2">
      <AlertCircle /> Erro ao carregar dados do servidor.
    </div>
  );

  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-800">Receção de Encomendas</h2>
        <p className="text-slate-500 font-medium">Apenas encomendas "Em Trânsito" podem ser conferidas.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">Em Trânsito</p>
            <p className="text-2xl font-black text-blue-600">
              {orders.filter(o => o.estado === 'Em Trânsito').length}
            </p>
          </div>
          <TruckIcon className="text-blue-200 h-8 w-8" />
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">Pendentes</p>
            <p className="text-2xl font-black text-orange-600">
              {orders.filter(o => o.estado === 'Pendente').length}
            </p>
          </div>
          <Calendar className="text-orange-200 h-8 w-8" />
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400">Rececionadas</p>
            <p className="text-2xl font-black text-green-600">
              {orders.filter(o => o.estado === 'Rececionada').length}
            </p>
          </div>
          <CheckCircle className="text-green-200 h-8 w-8" />
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const isExpanded = expandedOrder === order.encomendaID;
          const status = order.estado; // 'Pendente', 'Em Trânsito', 'Rececionada'
          
          // REGRA DE OURO: Só pode interagir se estiver Em Trânsito
          const canReceive = status === 'Em Trânsito';
          const isCompleted = status === 'Rececionada';

          return (
            <div key={order.encomendaID} className={`bg-white rounded-2xl border transition-all ${
              isCompleted ? 'border-green-100 bg-green-50/20 opacity-80' : 
              canReceive ? 'border-blue-200 shadow-sm' : 'border-slate-200 opacity-60'
            }`}>
              
              <div 
                onClick={() => setExpandedOrder(isExpanded ? null : order.encomendaID)}
                className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-black text-slate-800">#ENC-{order.encomendaID}</span>
                    <span className={`px-2 py-1 text-[9px] font-black uppercase rounded ${
                      status === 'Em Trânsito' ? 'bg-blue-100 text-blue-700' :
                      status === 'Rececionada' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-400 flex gap-4">
                    <span>Peça ID: {order.pecaID}</span>
                    <span>Qtd Esperada: {order.quantidade} UN</span>
                    <span>Pedida em: {new Date(order.dataPedido).toLocaleDateString()}</span>
                  </div>
                </div>

                {!canReceive && !isCompleted && (
                  <div className="flex items-center gap-2 text-[10px] font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-lg">
                    <AlertCircle size={12}/> Aguarda confirmação do Administrador
                  </div>
                )}

                <div className="p-2 rounded-lg bg-slate-50">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {isExpanded && (
                <div className="p-6 border-t border-slate-100 bg-white rounded-b-2xl animate-in slide-in-from-top-2">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-slate-700 mb-1">Conferência de Quantidade</h4>
                      <p className="text-xs text-slate-400">Verifique se as {order.quantidade} unidades chegaram sem danos.</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-3 p-2 rounded-xl border ${canReceive ? 'border-blue-200 bg-slate-50' : 'bg-slate-100 opacity-50'}`}>
                        <button 
                          disabled={!canReceive}
                          onClick={() => updateQuantity(order.encomendaID, (localQuantities[order.encomendaID] || 0) - 1)}
                          className="p-1 hover:bg-white rounded shadow-sm disabled:cursor-not-allowed"
                        >
                          <Minus size={16} />
                        </button>
                        <input 
                          type="number" 
                          readOnly={!canReceive}
                          value={localQuantities[order.encomendaID] ?? (isCompleted ? order.quantidade : 0)}
                          onChange={(e) => updateQuantity(order.encomendaID, parseInt(e.target.value))}
                          className="w-12 text-center font-black bg-transparent outline-none"
                        />
                        <button 
                          disabled={!canReceive}
                          onClick={() => updateQuantity(order.encomendaID, (localQuantities[order.encomendaID] || 0) + 1)}
                          className="p-1 hover:bg-white rounded shadow-sm disabled:cursor-not-allowed"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        disabled={!canReceive || (localQuantities[order.encomendaID] || 0) === 0}
                        className="px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase rounded-xl hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all cursor-pointer"
                      >
                        Confirmar Receção
                      </button>
                    </div>
                  </div>

                  {!canReceive && !isCompleted && (
                    <p className="mt-4 text-[10px] text-slate-400 italic text-center border-t pt-4">
                      Esta encomenda está em estado <strong>{status}</strong>. Só poderá confirmar a receção quando o fornecedor alterar para <strong>Em Trânsito</strong>.
                    </p>
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