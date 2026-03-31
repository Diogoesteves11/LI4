import { useState, useEffect, useMemo } from "react";
import { Plus, Edit, Trash2, Tag, Calendar, Percent, Sparkles, X, Loader2, AlertCircle } from "lucide-react";
import { usePromocoes } from "../../hooks/usePromocao";

export default function Promotions() {
  // 1. Hook de Dados da API
  const { data: apiPromocoes, isLoading, isError } = usePromocoes();

  // 2. Estado local para permitir Edição/Eliminação local (antes de implementares as Mutations)
  const [promotions, setPromotions] = useState([]);

  // Sincronizar dados da API com o estado local
  useEffect(() => {
    if (apiPromocoes) {
      const mappedPromos = apiPromocoes.map(p => ({
        id: p.promocaoID.toString(),
        nome: p.descricao,
        desconto: p.percentagemDesconto,
        dataInicio: p.dataInicio.split('T')[0], // Formata para o input date
        dataFim: p.dataFim.split('T')[0],
        ativa: checkIsActive(p.dataInicio, p.dataFim)
      }));
      setPromotions(mappedPromos);
    }
  }, [apiPromocoes]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    desconto: "",
    dataInicio: "",
    dataFim: "",
  });

  function checkIsActive(start, end) {
    const today = new Date();
    return today >= new Date(start) && today <= new Date(end);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // NOTA: Aqui deverias usar uma Mutation para gravar no C#
    if (editingId) {
      setPromotions(promotions.map((promo) =>
        promo.id === editingId
          ? {
              ...promo,
              nome: formData.nome,
              desconto: Number(formData.desconto),
              dataInicio: formData.dataInicio,
              dataFim: formData.dataFim,
              ativa: checkIsActive(formData.dataInicio, formData.dataFim)
            }
          : promo
      ));
    } else {
      const newPromotion = {
        id: Date.now().toString(),
        nome: formData.nome,
        desconto: Number(formData.desconto),
        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim,
        ativa: checkIsActive(formData.dataInicio, formData.dataFim),
      };
      setPromotions([...promotions, newPromotion]);
    }
    handleCancel();
  };

  const handleEdit = (promo) => {
    setEditingId(promo.id);
    setFormData({
      nome: promo.nome,
      desconto: promo.desconto.toString(),
      dataInicio: promo.dataInicio,
      dataFim: promo.dataFim,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if(window.confirm("Deseja eliminar esta campanha?")) {
        setPromotions(promotions.filter((promo) => promo.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData({ nome: "", desconto: "", dataInicio: "", dataFim: "" });
    setIsFormOpen(false);
    setEditingId(null);
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
      <p className="text-slate-500 font-bold">A carregar campanhas de 2026...</p>
    </div>
  );

  if (isError) return (
    <div className="p-8 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3">
      <AlertCircle />
      <p className="font-bold">Erro ao carregar promoções da base de dados.</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Marketing & Promoções</h1>
          <p className="text-lg font-medium text-slate-500">Gestão de campanhas da MobiFix</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
          >
            <Plus className="w-5 h-5" /> Nova Promoção
          </button>
        )}
      </div>

      {/* Formulário */}
      {isFormOpen && (
        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-50 p-8 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              {editingId ? "Editar Campanha" : "Nova Campanha"}
            </h2>
            <button onClick={handleCancel} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Nome</label>
                <input
                  type="text" required value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Desconto (%)</label>
                <input
                  type="number" required min="1" max="100" value={formData.desconto}
                  onChange={(e) => setFormData({ ...formData, desconto: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Início</label>
                <input
                  type="date" required value={formData.dataInicio}
                  onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-400">Fim</label>
                <input
                  type="date" required value={formData.dataFim}
                  onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-4 pt-4 border-t">
              <button type="submit" className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700">
                {editingId ? "Atualizar" : "Lançar"}
              </button>
              <button type="button" onClick={handleCancel} className="px-8 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Grid de Promoções */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {promotions.length === 0 ? (
          <div className="col-span-full py-20 text-center border-4 border-dashed border-slate-100 rounded-3xl text-slate-300 font-bold">
            Sem campanhas ativas.
          </div>
        ) : (
          promotions.map((promo) => (
            <div key={promo.id} className="bg-white rounded-3xl border-2 border-slate-50 p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className={`p-3 rounded-xl ${promo.ativa ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <Tag size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{promo.nome}</h3>
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${promo.ativa ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                      {promo.ativa ? "● Em Vigor" : "○ Fora de Data"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(promo)} className="p-2 text-slate-300 hover:text-blue-600"><Edit size={18}/></button>
                  <button onClick={() => handleDelete(promo.id)} className="p-2 text-slate-300 hover:text-red-600"><Trash2 size={18}/></button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-slate-50 rounded-2xl">
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400">Desconto</p>
                  <p className="text-xl font-black text-blue-600">{promo.desconto}%</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400">Validade</p>
                  <p className="text-[11px] font-bold text-slate-700">{new Date(promo.dataInicio).toLocaleDateString()} - {new Date(promo.dataFim).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}