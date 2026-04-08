import { useState, useMemo } from "react";
import { Plus, Edit, Box, Tags, DollarSign, Layers, Loader2, ArrowUp, ArrowDown, ArrowUpDown, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { usePecas, useCriarPeca, useAtualizarPeca, useAlterarEstadoPeca } from "../../hooks/usePecas";

const CATEGORIA_COLORS = {
  BATERIAS: "bg-purple-100 text-purple-700 border-purple-200",
  TRAVOES: "bg-red-100 text-red-700 border-red-200",
  PNEUS: "bg-amber-100 text-amber-700 border-amber-200",
  MOTOR: "bg-blue-100 text-blue-700 border-blue-200",
  OUTROS: "bg-slate-100 text-slate-700 border-slate-200",
};

const FORM_EMPTY = {
  ean: "",
  nome: "",
  categoria: "OUTROS",
  pvp: "", 
  stockAtual: "", 
  descricao: "",
  ativo: true,
};

export default function PecasManagement() {
  const { data: pecas = [], isLoading, isError } = usePecas();
  const criarMutation = useCriarPeca();
  const atualizarMutation = useAtualizarPeca();
  const alterarEstadoMutation = useAlterarEstadoPeca();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEan, setEditingEan] = useState(null);
  const [formData, setFormData] = useState(FORM_EMPTY);
  
  const [sortConfig, setSortConfig] = useState({ key: "Nome", direction: "asc" });

  const isPending = criarMutation.isPending || atualizarMutation.isPending || alterarEstadoMutation.isPending;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = {
        CodigoEAN: formData.ean,
        Nome: formData.nome,
        Categoria: formData.categoria,
        PVP: parseFloat(formData.pvp),
        StockAtual: parseInt(formData.stockAtual, 10),
        Descricao: formData.descricao,
        Ativo: formData.ativo,
        CustoAquisicao: 0,
        StockMinimo: 5,
        PadraoReposicao: 5,
        Imagem: ""
    };

    if (editingEan) {
      atualizarMutation.mutate(
        { ean: editingEan, dados: payload },
        { onSuccess: handleCancel }
      );
    } else {
      criarMutation.mutate(payload, { onSuccess: handleCancel });
    }
  };

  const handleEdit = (peca) => {
    setEditingEan(peca.CodigoEAN); 
    setFormData({
      ean: peca.CodigoEAN, 
      nome: peca.Nome,
      categoria: peca.Categoria,
      pvp: peca.PVP?.toString() || "",
      stockAtual: peca.StockAtual?.toString() || "",
      descricao: peca.Descricao ?? "",
      ativo: peca.Ativo !== false, 
    });
    setIsFormOpen(true);
  };

 const handleToggleAtivo = (peca) => {
    const payload = {
        CodigoEAN: peca.CodigoEAN,
        Nome: peca.Nome,
        Categoria: peca.Categoria,
        PVP: peca.PVP,
        StockAtual: peca.StockAtual,
        Descricao: peca.Descricao ?? "",
        Ativo: !peca.Ativo, 
        
        CustoAquisicao: peca.CustoAquisicao ?? 0,
        StockMinimo: peca.StockMinimo ?? 5,
        PadraoReposicao: peca.PadraoReposicao ?? 5,
        Imagem: peca.Imagem ?? ""
    };

    atualizarMutation.mutate({ 
        ean: peca.CodigoEAN, 
        dados: payload 
    });
  };

  const handleCancel = () => {
    setFormData(FORM_EMPTY);
    setIsFormOpen(false);
    setEditingEan(null);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedPecas = useMemo(() => {
    let sortableItems = [...pecas];
    sortableItems.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) aValue = "";
      if (bValue === null || bValue === undefined) bValue = "";

      if (sortConfig.key === "PVP" || sortConfig.key === "StockAtual") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } 
      else if (sortConfig.key === "Ativo") {
         aValue = aValue ? 1 : 0;
         bValue = bValue ? 1 : 0;
      }
      else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sortableItems;
  }, [pecas, sortConfig]);

  const field = (label, content) => (
    <div className="space-y-2">
      <label className="text-xs font-black uppercase text-slate-500">{label}</label>
      {content}
    </div>
  );

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-slate-100 outline-none focus:border-blue-500 bg-slate-50 transition-colors";

  const renderSortableHeader = (label, columnKey) => {
    const isActive = sortConfig.key === columnKey;
    return (
      <th 
        className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition-colors group select-none"
        onClick={() => handleSort(columnKey)}
      >
        <div className="flex items-center gap-2">
          {label}
          {isActive ? (
            sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3 text-blue-600" /> : <ArrowDown className="w-3 h-3 text-blue-600" />
          ) : (
            <ArrowUpDown className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </th>
    );
  };

  const pecasAtivas = pecas.filter(p => p.Ativo !== false);
  const totalPecas = pecas.length;
  const pecasSemStock = pecasAtivas.filter(p => p.StockAtual === 0).length;
  const valorEmStock = pecasAtivas.reduce((acc, curr) => acc + (curr.PVP * curr.StockAtual), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Catálogo de Peças</h1>
          <p className="text-lg font-medium text-slate-500">Gestão de inventário e preçário</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
        >
          <Plus className="w-5 h-5" /> Nova Peça
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total de Referências", value: totalPecas, icon: Box, color: "blue" },
          { label: "Ativas Sem Stock", value: pecasSemStock, icon: AlertCircle, color: pecasSemStock > 0 ? "red" : "emerald" },
          { label: "Valor em Armazém (Ativo)", value: `${valorEmStock.toFixed(2)}€`, icon: DollarSign, color: "purple" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`bg-${stat.color}-100 p-3 rounded-xl`}>
                <stat.icon className={`w-7 h-7 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-500/20 p-8 animate-in slide-in-from-top-4">
          <h2 className="text-2xl font-black text-slate-900 mb-6">
            {editingEan ? "Atualizar Peça" : "Registar Nova Peça"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {!editingEan && field("Código EAN / Referência",
              <input
                type="text"
                required
                value={formData.ean}
                onChange={(e) => setFormData({ ...formData, ean: e.target.value })}
                placeholder="Ex: EAN590123"
                className={inputClass}
              />
            )}

            {field("Nome da Peça",
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: Pastilhas de Travão"
                className={editingEan ? "md:col-span-2 lg:col-span-1 " + inputClass : inputClass}
              />
            )}

            {field("Categoria",
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className={inputClass}
              >
                <option value="BATERIAS">Baterias</option>
                <option value="TRAVOES">Travões</option>
                <option value="PNEUS">Pneus</option>
                <option value="MOTOR">Motor & Transmissão</option>
                <option value="OUTROS">Outros Componentes</option>
              </select>
            )}

            {field("Preço (€)",
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.pvp}
                onChange={(e) => setFormData({ ...formData, pvp: e.target.value })}
                placeholder="0.00"
                className={inputClass}
              />
            )}

            {field("Stock Atual",
              <input
                type="number"
                min="0"
                step="1"
                required
                value={formData.stockAtual}
                onChange={(e) => setFormData({ ...formData, stockAtual: e.target.value })}
                placeholder="Quantidade"
                className={inputClass}
              />
            )}
            
            {editingEan && (
              <div className="space-y-2 lg:col-span-1">
                <label className="text-xs font-black uppercase text-slate-500">Estado no Catálogo</label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50 h-[52px]">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <label htmlFor="ativo" className="text-sm font-bold text-slate-700 cursor-pointer">
                    Peça disponível
                  </label>
                </div>
              </div>
            )}

            <div className="md:col-span-2 lg:col-span-3">
              {field("Descrição (Opcional)",
                <textarea
                  rows="2"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Detalhes técnicos, compatibilidades..."
                  className={inputClass + " resize-none"}
                />
              )}
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isPending}
                className={`flex items-center gap-2 px-8 py-3 text-white font-black rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all ${
                  isPending ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingEan ? "Guardar Alterações" : "Adicionar ao Catálogo"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="font-bold">A carregar catálogo...</span>
          </div>
        ) : isError ? (
          <div className="py-20 text-center text-red-500 font-bold">
            Erro ao carregar o catálogo. Verifica a ligação à API.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  {renderSortableHeader("Peça", "Nome")}
                  {renderSortableHeader("Categoria", "Categoria")}
                  {renderSortableHeader("Preço Unitário", "PVP")}
                  {renderSortableHeader("Disponibilidade", "StockAtual")}
                  {renderSortableHeader("Status", "Ativo")}
                  <th className="px-6 py-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedPecas.map((peca) => {
                  const isAtivo = peca.Ativo !== false; 
                  
                  return (
                    <tr key={peca.CodigoEAN} className={`hover:bg-slate-50/50 transition-colors ${!isAtivo ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 shadow-sm border ${isAtivo ? 'bg-slate-100 border-slate-200' : 'bg-slate-50 border-slate-100'}`}>
                            <Box className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{peca.Nome}</div>
                            <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                              <Tags className="w-3 h-3" /> {peca.CodigoEAN}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black border ${CATEGORIA_COLORS[peca.Categoria] ?? CATEGORIA_COLORS.OUTROS}`}>
                          <Layers className="w-3 h-3" />
                          {peca.Categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        {Number(peca.PVP).toFixed(2)} €
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`text-sm font-black ${peca.StockAtual > 5 ? 'text-emerald-600' : peca.StockAtual > 0 ? 'text-amber-500' : 'text-red-500'}`}>
                            {peca.StockAtual} un.
                          </span>
                          {peca.StockAtual === 0 && isAtivo && <span className="text-[10px] text-red-400 font-bold uppercase">Esgotado</span>}
                          {peca.StockAtual > 0 && peca.StockAtual <= 5 && isAtivo && <span className="text-[10px] text-amber-500 font-bold uppercase">Baixo Stock</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${isAtivo ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                          {isAtivo ? "● Ativo" : "○ Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(peca)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Editar Peça"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => handleToggleAtivo(peca)}
                            disabled={alterarEstadoMutation.isPending}
                            className={`p-2 rounded-lg transition-all ${
                              isAtivo
                                ? "text-slate-400 hover:text-red-600 hover:bg-red-50"
                                : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                            }`}
                            title={isAtivo ? "Desativar Peça" : "Ativar Peça"}
                          >
                            {isAtivo ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}