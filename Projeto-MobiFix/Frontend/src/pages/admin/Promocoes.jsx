import { useState } from "react";
import { Plus, Edit, Trash2, Tag, Calendar, Percent, Sparkles, X } from "lucide-react";

export default function Promotions() {
  const [promotions, setPromotions] = useState([
    {
      id: "1",
      nome: "Desconto de Verão",
      desconto: 15,
      dataInicio: "2026-06-01",
      dataFim: "2026-08-31",
      ativa: false,
    },
    {
      id: "2",
      nome: "Promoção Primavera",
      desconto: 20,
      dataInicio: "2026-03-15",
      dataFim: "2026-04-30",
      ativa: true,
    },
    {
      id: "3",
      nome: "Black Friday",
      desconto: 30,
      dataInicio: "2026-11-25",
      dataFim: "2026-11-27",
      ativa: false,
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    desconto: "",
    dataInicio: "",
    dataFim: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      setPromotions(
        promotions.map((promo) =>
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
        )
      );
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

  const checkIsActive = (start, end) => {
    const today = new Date();
    return today >= new Date(start) && today <= new Date(end);
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
    if(window.confirm("Tem a certeza que deseja eliminar esta promoção?")) {
        setPromotions(promotions.filter((promo) => promo.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData({ nome: "", desconto: "", dataInicio: "", dataFim: "" });
    setIsFormOpen(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Marketing & Promoções
          </h1>
          <p className="text-lg font-medium text-slate-500">
            Crie campanhas para impulsionar as reparações na MobiFix
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5" />
            Nova Promoção
          </button>
        )}
      </div>

      ---

      {/* Formulário Estilizado */}
      {isFormOpen && (
        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8 animate-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-500" />
              {editingId ? "Editar Campanha" : "Lançar Nova Campanha"}
            </h2>
            <button onClick={handleCancel} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-slate-500">
                  Nome da Promoção
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                  placeholder="Ex: Verão 2026"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-slate-500">
                  Desconto (%)
                </label>
                <div className="relative">
                  <Percent className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={formData.desconto}
                    onChange={(e) => setFormData({ ...formData, desconto: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                    placeholder="20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-slate-500">
                  Data de Início
                </label>
                <input
                  type="date"
                  required
                  value={formData.dataInicio}
                  onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-widest text-slate-500">
                  Data de Fim
                </label>
                <input
                  type="date"
                  required
                  value={formData.dataFim}
                  onChange={(e) => setFormData({ ...formData, dataFim: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="flex-1 md:flex-none px-10 py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
              >
                {editingId ? "Guardar Alterações" : "Ativar Campanha"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-10 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid de Promoções */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {promotions.length === 0 ? (
          <div className="col-span-full p-20 text-center border-4 border-dashed border-slate-100 rounded-3xl">
            <Tag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-2xl font-bold text-slate-400">Nenhuma promoção ativa no momento</p>
          </div>
        ) : (
          promotions.map((promo) => (
            <div
              key={promo.id}
              className="group relative bg-white rounded-3xl border-2 border-slate-100 p-8 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-5">
                  <div className={`p-4 rounded-2xl transition-colors ${promo.ativa ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-slate-100'}`}>
                    <Tag className={`w-8 h-8 ${promo.ativa ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {promo.nome}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        promo.ativa ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {promo.ativa ? "● Em Vigor" : "○ Agendada / Terminada"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(promo)} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(promo.id)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Impacto</span>
                  <div className="flex items-center gap-1 text-2xl font-black text-blue-600">
                    <Percent className="w-5 h-5" />
                    {promo.desconto}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Validade</span>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {new Date(promo.dataInicio).toLocaleDateString("pt-PT")} - {new Date(promo.dataFim).toLocaleDateString("pt-PT")}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}