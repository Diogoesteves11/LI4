import { useState } from "react";
import { Check, X, Package, Calendar, Clock, User, Euro, History } from "lucide-react";

export default function StockOrders() {
  // Removida a interface StockOrder e a tipagem do useState
  const [orders, setOrders] = useState([
    {
      id: "1",
      item: "Ecrã LCD iPhone 13",
      quantidade: 15,
      fornecedor: "TechParts Ltd",
      solicitante: "João Silva",
      data: "2026-03-20",
      custo: 1250,
      status: "pendente",
    },
    {
      id: "2",
      item: "Bateria Samsung Galaxy S22",
      quantidade: 20,
      fornecedor: "Mobile Parts Pro",
      solicitante: "Maria Santos",
      data: "2026-03-21",
      custo: 680,
      status: "pendente",
    },
    {
      id: "3",
      item: "Conector de Carga USB-C",
      quantidade: 50,
      fornecedor: "Universal Parts",
      solicitante: "Pedro Costa",
      data: "2026-03-22",
      custo: 175,
      status: "pendente",
    },
    {
      id: "4",
      item: "Câmera Traseira iPhone 14 Pro",
      quantidade: 10,
      fornecedor: "Apple Parts Direct",
      solicitante: "Ana Rodrigues",
      data: "2026-03-23",
      custo: 950,
      status: "pendente",
    },
    {
      id: "5",
      item: "Alto-falante Xiaomi Mi 11",
      quantidade: 25,
      fornecedor: "Asia Components",
      solicitante: "Carlos Mendes",
      data: "2026-03-23",
      custo: 320,
      status: "pendente",
    },
  ]);

  const handleApprove = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: "aprovado" } : order
      )
    );
  };

  const handleReject = (id) => {
    setOrders(
      orders.map((order) =>
        order.id === id ? { ...order, status: "rejeitado" } : order
      )
    );
  };

  const pendingOrders = orders.filter((order) => order.status === "pendente");
  const processedOrders = orders.filter((order) => order.status !== "pendente");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header da Página */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          Encomendas de Stock
        </h1>
        <p className="text-lg font-medium text-slate-500">
          Gestão e aprovação de pedidos de componentes
        </p>
      </div>

      {/* Grid de Estatísticas (Cartões) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pendentes */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-100 p-6 transition-all hover:shadow-md">
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

        {/* Aprovadas */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-100 p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-xl">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Aprovadas</p>
              <p className="text-3xl font-black text-slate-900">
                {orders.filter((o) => o.status === "aprovado").length}
              </p>
            </div>
          </div>
        </div>

        {/* Custo Total Pendente */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-100 p-6 transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Euro className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Total em Aberto</p>
              <p className="text-3xl font-black text-slate-900">
                €{pendingOrders.reduce((acc, curr) => acc + curr.custo, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Secção de Encomendas Pendentes (Tabela principal) */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-6 bg-linear-to-r from-slate-50 to-white border-b border-slate-200">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            Pedidos Aguardando Revisão
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-black uppercase tracking-widest border-b border-slate-200">
                <th className="px-6 py-4">Item / Peça</th>
                <th className="px-6 py-4">Quantidade</th>
                <th className="px-6 py-4">Fornecedor</th>
                <th className="px-6 py-4">Solicitante</th>
                <th className="px-6 py-4">Custo</th>
                <th className="px-6 py-4 text-center">Decisão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium italic">
                    Não existem encomendas pendentes de aprovação.
                  </td>
                </tr>
              ) : (
                pendingOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <Package className="w-5 h-5 text-slate-600" />
                        </div>
                        <span className="font-bold text-slate-900">{order.item}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-mono text-slate-600">{order.quantidade} un.</td>
                    <td className="px-6 py-5 text-slate-500">{order.fornecedor}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 font-semibold text-slate-700">
                        <User className="w-4 h-4" />
                        {order.solicitante}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-lg font-black text-slate-900">
                        €{order.custo.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleApprove(order.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-200"
                        >
                          <Check className="w-4 h-4" /> Aprovar
                        </button>
                        <button
                          onClick={() => handleReject(order.id)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-200"
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

      {/* Histórico Recente (Apenas se houver processadas) */}
      {processedOrders.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
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
                  <th className="px-6 py-3">Item</th>
                  <th className="px-6 py-3">Fornecedor</th>
                  <th className="px-6 py-3 text-right">Custo</th>
                  <th className="px-6 py-3 text-center">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processedOrders.map((order) => (
                  <tr key={order.id} className="opacity-80">
                    <td className="px-6 py-4 font-bold text-slate-800">{order.item}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{order.fornecedor}</td>
                    <td className="px-6 py-4 text-right font-black">€{order.custo.toLocaleString()}</td>
                    <td className="px-6 py-4 flex justify-center">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                          order.status === "aprovado"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status === "aprovado" ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
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