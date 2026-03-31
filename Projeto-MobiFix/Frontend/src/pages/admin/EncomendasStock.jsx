import { useState, useMemo, useEffect } from "react";
import { 
  Check, X, Package, Calendar, Clock, User, 
  Euro, History, Loader2, AlertCircle 
} from "lucide-react";
import { useEncomendaStock } from "../../hooks/useEncomendas";

export default function StockOrders() {
  // 1. Chamada ao Hook Real
  const { data: apiOrders, isLoading, isError } = useEncomendaStock();
  
  // 2. Estado local para gerir as decisões (Aprovar/Rejeitar) na UI
  const [orders, setOrders] = useState([]);

  // Sincroniza os dados da API com o estado local assim que carregam
  useEffect(() => {
    if (apiOrders) {
      setOrders(apiOrders.map(o => ({
        id: o.encomendaID,
        item: `Peça #${o.pecaID}`, // Idealmente aqui farias um JOIN com a tabela Pecas
        quantidade: o.quantidade,
        fornecedor: "Fornecedor Padrão", // Placeholder (não existe na tabela EncomendasStock)
        solicitante: `Admin #${o.adminValidadorID}`,
        data: new Date(o.dataPedido).toLocaleDateString('pt-PT'),
        custo: o.quantidade * 15, // Estimativa (Podes cruzar com o PVP da peça depois)
        status: o.estado.toLowerCase() // 'pendente', 'em trânsito', 'rececionada'
      })));
    }
  }, [apiOrders]);

  const handleApprove = (id) => {
    // Aqui no futuro chamarias uma Mutation para mudar para 'Em Trânsito'
    setOrders(prev =>
      prev.map((order) =>
        order.id === id ? { ...order, status: "aprovado" } : order
      )
    );
  };

  const handleReject = (id) => {
    // Aqui no futuro chamarias uma Mutation para cancelar a encomenda
    setOrders(prev =>
      prev.map((order) =>
        order.id === id ? { ...order, status: "rejeitado" } : order
      )
    );
  };

  // Filtros baseados no estado local
  const pendingOrders = orders.filter((order) => order.status === "pendente");
  const processedOrders = orders.filter((order) => 
    order.status === "aprovado" || order.status === "rejeitado" || order.status === "rececionada"
  );

  if (isLoading) return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
      <p className="text-slate-500 font-bold">A carregar pedidos de stock...</p>
    </div>
  );

  if (isError) return (
    <div className="p-8 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3">
      <AlertCircle />
      <p className="font-bold">Erro ao ligar ao servidor de gestão de stock.</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header da Página */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Encomendas de Stock
        </h1>
        <p className="text-lg font-medium text-slate-500">
          Aprovação de pedidos pendentes da base de dados
        </p>
      </div>

      {/* Grid de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-100 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-xl">
              <Package className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Pendentes</p>
              <p className="text-3xl font-black text-slate-900">{pendingOrders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-100 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Aprovadas</p>
              <p className="text-3xl font-black text-slate-900">
                {orders.filter((o) => o.status === "aprovado" || o.status === "rececionada").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-100 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Euro className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Total Pendente</p>
              <p className="text-3xl font-black text-slate-900">
                €{pendingOrders.reduce((acc, curr) => acc + curr.custo, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Pedidos Pendentes */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Pedidos Aguardando Revisão
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-black uppercase tracking-widest border-b border-slate-200">
                <th className="px-6 py-4">ID / Peça</th>
                <th className="px-6 py-4 text-center">Quantidade</th>
                <th className="px-6 py-4">Solicitante</th>
                <th className="px-6 py-4">Data Pedido</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic font-medium">
                    Não existem encomendas pendentes.
                  </td>
                </tr>
              ) : (
                pendingOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900">#{order.id} - {order.item}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center font-mono font-bold text-blue-600">{order.quantidade} un.</td>
                    <td className="px-6 py-5 font-semibold text-slate-700">{order.solicitante}</td>
                    <td className="px-6 py-5 text-slate-500 text-sm">{order.data}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleApprove(order.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-100"
                        >
                          <Check className="w-4 h-4" /> Aprovar
                        </button>
                        <button
                          onClick={() => handleReject(order.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-100"
                        >
                          <X className="w-4 h-4" /> Rejeitar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Histórico Recente */}
      {processedOrders.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden opacity-90">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-500" />
              Histórico de Decisões
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-3">ID Pedido</th>
                  <th className="px-6 py-3">Peça</th>
                  <th className="px-6 py-3 text-center">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processedOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 font-mono text-xs">#{order.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{order.item}</td>
                    <td className="px-6 py-4 flex justify-center">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          order.status === "aprovado" || order.status === "rececionada"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}