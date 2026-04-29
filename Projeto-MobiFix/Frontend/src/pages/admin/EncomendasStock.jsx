import { useState } from "react";
import {
  Check, X, Package, Clock, Plus, Sparkles,
  Euro, History, Loader2, AlertCircle, Trash2, Info, User, CheckCircle2
} from "lucide-react";
import { useEncomendaStock, useCriarEncomendaStock, useAtualizarEncomendaStock, useEliminarEncomendaStock } from "../../hooks/useEncomendas";
import { usePecas } from "../../hooks/usePecas";

const getLoggedUserId = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return "SISTEMA";

    const payloadBase64 = token.split('.')[1];
    const decodedJson = atob(payloadBase64);
    const payload = JSON.parse(decodedJson);

    return payload.id || "ADMIN_DESCONHECIDO";
  } catch (error) {
    console.error("Erro ao ler o token:", error);
    return "ERRO_TOKEN";
  }
};

export default function StockOrders() {
  const { data: apiOrders, isLoading, isError } = useEncomendaStock();
  const { data: apiPecas } = usePecas();

  const criarMutation = useCriarEncomendaStock();
  const atualizarMutation = useAtualizarEncomendaStock();
  const eliminarMutation = useEliminarEncomendaStock();

  const userId = getLoggedUserId();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ pecaEAN: "", quantidade: "" });
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = (apiOrders || []).map(o => ({
    id: o.EncomendaID || o.encomendaID,
    pecaEAN: o.PecaEAN || o.pecaEAN,
    item: (() => {
      const ean = o.PecaEAN || o.pecaEAN;
      const peca = apiPecas?.find(p => p.CodigoEAN === ean);
      return peca ? peca.Nome : `Peça #${ean}`;
    })(),
    quantidade: o.Quantidade || o.quantidade,
    solicitante: o.AdminValidadorNumero || o.adminValidadorNumero || "N/A",
    receptor: o.OperadorRececaoNumero || o.operadorRececaoNumero || "N/A",
    data: new Date(o.DataPedido || o.dataPedido).toLocaleDateString('pt-PT'),
    custo: (() => {
      const ean = o.PecaEAN || o.pecaEAN;
      const qt = o.Quantidade || o.quantidade;
      const peca = apiPecas?.find(p => p.CodigoEAN === ean);
      return peca ? peca.CustoAquisicao * qt : qt * 15;
    })(),
    status: (o.Estado || o.estado || "pendente").toLowerCase()
  }));

  const pendingOrders = orders.filter(o => o.status === "pendente");
  const transitOrders = orders.filter(o => o.status === "transito");
  const processedOrders = orders.filter(o => o.status === "rececionada" || o.status === "concluida");

  const handleApprove = (id) => {
    atualizarMutation.mutate({ id, dados: { Estado: "TRANSITO" } });
  };

  const handleReject = (id) => {
    if (window.confirm("Deseja eliminar esta encomenda?")) {
      eliminarMutation.mutate(id);
    }
  };

  const handleRececionada = (id) => {
    atualizarMutation.mutate({ 
      id, 
      dados: { 
        Estado: "RECECIONADA",
        OperadorRececaoNumero: userId 
      } 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    criarMutation.mutate({
      PecaEAN: formData.pecaEAN,
      Quantidade: Number(formData.quantidade),
      AdminValidadorNumero: userId
    });
    setFormData({ pecaEAN: "", quantidade: "" });
    setIsFormOpen(false);
  };

  const pecasDisponiveis = apiPecas?.filter(p => p.Ativo) || [];

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
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Encomendas de Stock</h1>
          <p className="text-sm font-medium text-slate-500">Gestão de pedidos de reposição</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
          >
            <Plus className="w-5 h-5" /> Nova Encomenda
          </button>
        )}
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-50 p-8 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-500" /> Nova Encomenda de Stock
            </h2>
            <button onClick={() => { setIsFormOpen(false); setFormData({ pecaEAN: "", quantidade: "" }); }} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Peça</label>
                <select
                  required
                  value={formData.pecaEAN}
                  onChange={(e) => setFormData({ ...formData, pecaEAN: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none text-slate-900"
                >
                  <option value="">Selecionar peça...</option>
                  {pecasDisponiveis.map(p => (
                    <option key={p.CodigoEAN} value={p.CodigoEAN}>
                      {p.Nome} ({p.CodigoEAN}) — Stock: {p.StockAtual}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Quantidade</label>
                <input
                  type="number" required min="1" value={formData.quantidade}
                  onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none text-slate-900"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={criarMutation.isPending}
                className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 disabled:opacity-50"
              >
                {criarMutation.isPending ? "A criar..." : "Criar Encomenda"}
              </button>
              <button type="button" onClick={() => { setIsFormOpen(false); setFormData({ pecaEAN: "", quantidade: "" }); }} className="px-8 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-100 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-xl"><Package className="w-8 h-8 text-amber-600" /></div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Pendentes</p>
              <p className="text-3xl font-black text-slate-900">{pendingOrders.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-100 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl"><Clock className="w-8 h-8 text-blue-600" /></div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Em Trânsito</p>
              <p className="text-3xl font-black text-slate-900">{transitOrders.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-100 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-xl"><Check className="w-8 h-8 text-emerald-600" /></div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">Rececionadas</p>
              <p className="text-3xl font-black text-slate-900">{processedOrders.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" /> Pedidos Pendentes
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs font-black uppercase tracking-widest border-b border-slate-200">
                <th className="px-6 py-4">ID / Peça</th>
                <th className="px-6 py-4 text-center">Quantidade</th>
                <th className="px-6 py-4">Data Pedido</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingOrders.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-400 italic font-medium">Não existem encomendas pendentes.</td></tr>
              ) : (
                pendingOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-5"><span className="font-bold text-slate-900">#{order.id} - {order.item}</span></td>
                    <td className="px-6 py-5 text-center font-mono font-bold text-blue-600">{order.quantidade} un.</td>
                    <td className="px-6 py-5 text-slate-500 text-sm">{order.data}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleApprove(order.id); }}
                          disabled={atualizarMutation.isPending}
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" /> Aprovar
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleReject(order.id); }}
                          disabled={eliminarMutation.isPending}
                          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-100 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" /> Rejeitar
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

      {transitOrders.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" /> Em Trânsito
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-3">ID / Peça</th>
                  <th className="px-6 py-3 text-center">Quantidade</th>
                  <th className="px-6 py-3">Data</th>
                  <th className="px-6 py-3 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transitOrders.map((order) => (
                  <tr 
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-bold text-slate-800">#{order.id} - {order.item}</td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-blue-600">{order.quantidade} un.</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{order.data}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRececionada(order.id); }}
                        disabled={atualizarMutation.isPending}
                        className="flex items-center gap-1.5 px-4 py-2 mx-auto bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" /> Marcar Rececionada
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {processedOrders.length > 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden opacity-90">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-500" /> Histórico (Rececionadas)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Peça</th>
                  <th className="px-6 py-3 text-center">Quantidade</th>
                  <th className="px-6 py-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processedOrders.map((order) => (
                  <tr 
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-mono text-xs">#{order.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{order.item}</td>
                    <td className="px-6 py-4 text-center font-mono font-bold">{order.quantidade} un.</td>
                    <td className="px-6 py-4 flex justify-center">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-700">
                        Rececionada
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                Detalhes da Encomenda
              </h3>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Nº Encomenda</p>
                  <p className="text-lg font-black text-slate-900">#{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Estado</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase 
                    ${selectedOrder.status === 'pendente' ? 'bg-amber-100 text-amber-700' : 
                      selectedOrder.status === 'transito' ? 'bg-blue-100 text-blue-700' : 
                      'bg-emerald-100 text-emerald-700'}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="col-span-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Peça Solicitada</p>
                  <p className="text-lg font-bold text-slate-900">{selectedOrder.item}</p>
                  <p className="text-sm font-mono text-slate-500 mt-1">EAN: {selectedOrder.pecaEAN}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Quantidade</p>
                  <p className="text-2xl font-black font-mono text-blue-600">{selectedOrder.quantidade} un.</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Custo Total</p>
                  <p className="text-2xl font-black text-slate-900">
                    <Euro className="w-5 h-5 inline text-slate-400 -mt-1" />
                    {selectedOrder.custo.toFixed(2)}
                  </p>
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-4 mt-2 border-t border-slate-100 pt-5">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1">
                        <User className="w-3 h-3" /> Solicitante
                      </p>
                      <p className="text-sm font-bold text-slate-700">Admin #{selectedOrder.solicitante}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{selectedOrder.data}</p>
                    </div>
                    {(selectedOrder.status === 'rececionada' || selectedOrder.status === 'concluida') && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Rececionado Por
                        </p>
                        <p className="text-sm font-bold text-emerald-700">Admin #{selectedOrder.receptor}</p>
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
               <button 
                 onClick={() => setSelectedOrder(null)} 
                 className="px-6 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors"
               >
                 Fechar
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}