import { Scooter, Search, ShoppingCart, Loader2, AlertCircle } from "lucide-react";
import { useState, useMemo } from "react";
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";
import { usePecas } from "../../hooks/usePecas";

const categories = ["Todas", "Bateria", "Pneu", "Travões", "Pastilhas", "Manete"];

export default function Catalogo() {
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: pecas, isLoading, isError } = usePecas();

  // Lógica de Filtro e Pesquisa
  const filteredProducts = useMemo(() => {
    if (!pecas) return [];

    return pecas.filter((p) => {
      // EXTRAÇÃO DA CATEGORIA: Pegamos a primeira palavra do nome
      // Ex: "Bateria Xiaomi Mi" -> "Bateria"
      const derivedCategory = p.nome ? p.nome.split(" ")[0] : "Geral";

      // Filtro por Categoria
      const matchesCategory = 
        activeFilter === "Todas" || 
        derivedCategory.toLowerCase() === activeFilter.toLowerCase();
      
      // Filtro por Pesquisa
      const matchesSearch = 
        p.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ean?.includes(searchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [pecas, activeFilter, searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-2" />
        <p className="text-slate-500 font-medium">A carregar catálogo...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-lg font-bold text-slate-900">Erro ao carregar peças</h2>
        <p className="text-slate-500">Verifica a tua ligação ou se o servidor está online.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-28">
      <Header title="Catálogo de Peças" showBack />
      
      <div className="p-5">
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex gap-3 shadow-sm">
          <Scooter className="text-blue-600 shrink-0" size={18} />
          <p className="text-xs text-blue-800 leading-relaxed font-medium">
            Reserve peças para levantar na loja MobiFix.
          </p>
        </section>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por nome ou EAN..."
            className="w-full bg-slate-100 border border-slate-200 rounded-full px-5 pl-11 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all shadow-inner"
          />
        </div>

        <section className="mb-8 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`text-xs px-4 py-2 rounded-full font-bold border whitespace-nowrap transition-all active:scale-95 ${
                  activeFilter === category
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <article 
                key={p.ean} 
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100/50 flex flex-col h-full"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-200">
                  <img 
                    src={`../../../${p.imagem}`} 
                    alt={p.nome}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    // Fallback para imagem caso p.imagem falhe
                    onError={(e) => { e.target.src = "https://placehold.co/400x300?text=Peca"; }}
                  />
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {/* AQUI: Exibimos a primeira palavra do nome como categoria */}
                      {p.nome ? p.nome.split(" ")[0] : "Geral"}
                    </span>
                    <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                      EAN: {p.ean}
                    </span>
                  </div>
                  
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">
                    {p.nome}
                  </h2>
                  
                  <p className="text-xs text-slate-500 mt-2 mb-4 line-clamp-2">
                    {p.descricao}
                  </p>

                  <div className="mt-auto">
                    <div className="flex justify-between items-baseline mb-3">
                      <p className="text-xl font-black text-blue-600">
                        €{p.pvp?.toFixed(2)}
                      </p>
                      <p className={`text-[10px] font-medium italic ${p.stockAtual > 0 ? 'text-slate-400' : 'text-red-500 font-bold'}`}>
                        {p.stockAtual > 0 ? `Stock: ${p.stockAtual}` : 'Esgotado'}
                      </p>
                    </div>

                    <button 
                      disabled={p.stockAtual <= 0}
                      className={`w-full rounded-xl py-3 text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        p.stockAtual > 0 
                        ? "bg-slate-950 text-white hover:bg-slate-800" 
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                      }`}
                    >
                      <ShoppingCart size={16} />
                      {p.stockAtual > 0 ? "Reservar" : "Indisponível"}
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-slate-400">
              Nenhuma peça encontrada com estes critérios.
            </div>
          )}
        </section>
      </div>

      <BottomNav />
    </main>
  );
}