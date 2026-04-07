import { useState } from "react";
import { Wrench, Plus, Trash2, X, Loader2 } from "lucide-react";
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";
import { useTrotinetes, useCriarTrotinete, useEliminarTrotinete } from "../../hooks/useTrotinetes";

const STATUS_CONFIG = {
  true:  { label: "Em Serviço",   badge: "bg-orange-100 text-orange-700 border-orange-200",  icon: "text-orange-500" },
  false: { label: "Disponível",   badge: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: "text-slate-400"  },
};

const FORM_EMPTY = { numeroSerie: "", marca: "", modelo: "" };

// Ícone SVG de trotinete inline (lucide não tem Scooter em todas as versões)
function ScooterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
      <path d="M5 17H3v-4l3-5h8l2 3h2a2 2 0 0 1 2 2v4h-2"/>
      <path d="M11 8V5l-2-2"/>
    </svg>
  );
}

export default function Trotinetes() {
  const { data: trotinetes = [], isLoading, isError } = useTrotinetes();
  const criarMutation = useCriarTrotinete();
  const eliminarMutation = useEliminarTrotinete();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(FORM_EMPTY);
  const [confirmDelete, setConfirmDelete] = useState(null); // numeroSerie a confirmar

  const handleSubmit = (e) => {
    e.preventDefault();
    criarMutation.mutate(formData, {
      onSuccess: () => {
        setFormData(FORM_EMPTY);
        setIsFormOpen(false);
      },
    });
  };

  const handleConfirmDelete = () => {
    if (!confirmDelete) return;
    eliminarMutation.mutate(confirmDelete, {
      onSuccess: () => setConfirmDelete(null),
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-28">
      <Header title="Minhas Trotinetes" />

      <div className="p-5 space-y-4">

        {/* Botão adicionar */}
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-sm hover:border-corporate-blue hover:text-corporate-blue hover:bg-blue-50/50 transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" /> Registar Nova Trotinete
        </button>

        {/* Formulário de registo */}
        {isFormOpen && (
          <section className="bg-white rounded-2xl p-5 shadow-sm border-2 border-corporate-blue/20 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900">Nova Trotinete</h3>
              <button
                onClick={() => { setIsFormOpen(false); setFormData(FORM_EMPTY); }}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { label: "Número de Série", key: "numeroSerie", placeholder: "XM2024-0001" },
                { label: "Marca",           key: "marca",       placeholder: "Xiaomi" },
                { label: "Modelo",          key: "modelo",      placeholder: "Mi Pro 4" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-1.5">{label}</label>
                  <input
                    type="text"
                    required
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-corporate-blue focus:outline-none bg-slate-50 text-sm font-medium transition-all"
                  />
                </div>
              ))}

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={criarMutation.isPending}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-black text-sm transition-all active:scale-[0.98] ${
                    criarMutation.isPending ? "bg-slate-400 cursor-not-allowed" : "bg-deep-slate hover:bg-black"
                  }`}
                >
                  {criarMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {criarMutation.isPending ? "A registar..." : "Registar"}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsFormOpen(false); setFormData(FORM_EMPTY); }}
                  className="px-5 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Estados de carregamento / erro */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium text-sm">A carregar trotinetes...</span>
          </div>
        )}

        {isError && (
          <div className="py-16 text-center text-red-400 font-bold text-sm">
            Erro ao carregar as trotinetes. Tenta novamente.
          </div>
        )}

        {/* Lista */}
        {!isLoading && !isError && trotinetes.length === 0 && (
          <div className="py-16 text-center text-slate-300 font-bold text-sm">
            Ainda não tens nenhuma trotinete registada.
          </div>
        )}

        {trotinetes.map((t) => {
          const config = STATUS_CONFIG[String(t.EmServico)] ?? STATUS_CONFIG["false"];

          return (
            <section
              key={t.NumeroSerie}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 transition-all active:bg-slate-50"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <ScooterIcon className={`w-5 h-5 ${config.icon}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">{t.Marca} {t.Modelo}</h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">{t.NumeroSerie}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wider ${config.badge}`}>
                    {config.label}
                  </span>
                  {/* Só pode remover se não estiver em serviço */}
                  {!t.EmServico && (
                    <button
                      onClick={() => setConfirmDelete(t.NumeroSerie)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {t.EmServico && (
                <div className="flex items-center gap-2 py-2 px-3 bg-orange-50/50 rounded-lg border border-orange-100/50">
                  <Wrench className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-xs text-orange-800 font-medium">
                    Em serviço — não pode ser removida neste momento
                  </span>
                </div>
              )}
            </section>
          );
        })}
      </div>

     {/* Modal de confirmação de remoção */}
      {confirmDelete && (
        // Alterado: items-end -> items-center para centrar verticalmente
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          
          {/* Alterado: animação de slide para zoom/fade para ficar melhor no centro */}
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-black text-slate-900 text-lg mb-1">Remover Trotinete?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Esta ação é permanente. A trotinete <span className="font-mono font-bold text-slate-700">{confirmDelete}</span> será removida da tua conta.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleConfirmDelete}
                disabled={eliminarMutation.isPending}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-black text-sm transition-all active:scale-[0.98] ${
                  eliminarMutation.isPending ? "bg-slate-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {eliminarMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {eliminarMutation.isPending ? "A remover..." : "Sim, remover"}
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )} 

      <BottomNav />
    </main>
  );
}