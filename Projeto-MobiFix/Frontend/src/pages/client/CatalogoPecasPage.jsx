import { Search, ShoppingCart, Loader2, AlertCircle, Plus, Minus, Trash2, X, CheckCircle2 } from "lucide-react";
import { useState, useMemo } from "react";
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";
import { usePecas } from "../../hooks/usePecas";
import { useCriarReserva } from "../../hooks/useEncomendaCliente";

const categories = ["Todas", "Eletronica", "Travagem", "Pneu"];

// Ícone SVG de scooter inline
function ScooterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
      <path d="M5 17H3v-4l3-5h8l2 3h2a2 2 0 0 1 2 2v4h-2"/>
      <path d="M11 8V5l-2-2"/>
    </svg>
  );
}

export default function Catalogo() {
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [searchTerm, setSearchTerm]     = useState("");
  const [carrinho, setCarrinho]         = useState([]); // [{ peca, quantidade }]
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [reservaConcluida, setReservaConcluida] = useState(false);

  const { data: pecas, isLoading, isError } = usePecas();
  const criarReservaMutation = useCriarReserva();

  // ── Filtro ────────────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    if (!pecas) return [];
    return pecas.filter((p) => {
      const matchesCategory =
        activeFilter === "Todas" ||
        p.Categoria?.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch =
        p.Nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.CodigoEAN?.includes(searchTerm);
      return matchesCategory && matchesSearch;
    });
  }, [pecas, activeFilter, searchTerm]);

  // ── Carrinho helpers ──────────────────────────────────────────────────────
  const totalItens = carrinho.reduce((sum, i) => sum + i.quantidade, 0);
  const totalPreco = carrinho.reduce((sum, i) => sum + i.peca.PVP * i.quantidade, 0);

  const adicionarAoCarrinho = (peca) => {
    setCarrinho(prev => {
      const existente = prev.find(i => i.peca.CodigoEAN === peca.CodigoEAN);
      if (existente) {
        return prev.map(i =>
          i.peca.CodigoEAN === peca.CodigoEAN
            ? { ...i, quantidade: i.quantidade + 1 }
            : i
        );
      }
      return [...prev, { peca, quantidade: 1 }];
    });
  };

  const alterarQuantidade = (ean, delta) => {
    setCarrinho(prev =>
      prev
        .map(i => i.peca.CodigoEan === ean ? { ...i, quantidade: i.quantidade + delta } : i)
        .filter(i => i.quantidade > 0)
    );
  };

  const removerDoCarrinho = (ean) => {
    setCarrinho(prev => prev.filter(i => i.peca.CodigoEan !== ean));
  };

  const quantidadeNoCarrinho = (ean) =>
    carrinho.find(i => i.peca.CodigoEan === ean)?.quantidade ?? 0;

  // ── Submeter reserva ──────────────────────────────────────────────────────
  const handleConfirmarReserva = () => {
    const itens = carrinho.map(i => ({
      pecaEAN:       i.peca.CodigoEAN,
      quantidade:    i.quantidade,
      precoUnitario: i.peca.PVP,
    }));

    criarReservaMutation.mutate(itens, {
      onSuccess: () => {
        setCarrinho([]);
        setCarrinhoAberto(false);
        setReservaConcluida(true);
        setTimeout(() => setReservaConcluida(false), 4000);
      },
    });
  };

  // ── Loading / Error ───────────────────────────────────────────────────────
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
        {/* Banner informativo */}
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex gap-3 shadow-sm">
          <ScooterIcon className="text-blue-600 shrink-0 w-5 h-5 mt-0.5" />
          <p className="text-xs text-blue-800 leading-relaxed font-medium">
            Reserve peças para levantar na loja MobiFix. O pagamento é feito no balcão.
          </p>
        </section>

        {/* Toast de sucesso */}
        {reservaConcluida && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-3 duration-300">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold text-sm">Reserva confirmada! Levante na loja.</span>
          </div>
        )}

        {/* Barra de pesquisa + botão carrinho */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome ou EAN..."
              className="w-full bg-slate-100 border border-slate-200 rounded-full px-5 pl-11 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
            />
          </div>

          {/* Botão carrinho */}
          <button
            onClick={() => setCarrinhoAberto(true)}
            className="relative flex items-center justify-center w-12 h-12 bg-slate-950 text-white rounded-full shadow-lg active:scale-95 transition-all shrink-0"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItens > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                {totalItens}
              </span>
            )}
          </button>
        </div>

        {/* Filtros */}
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

        {/* Grid de produtos */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => {
              const qtd = quantidadeNoCarrinho(p.CodigoEAN);
              const esgotado = p.StockAtual <= 0;

              return (
                <article
                  key={p.CodigoEAN}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100/50 flex flex-col h-full"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-200">
                    <img
                      src={`../../../${p.Imagem}`}
                      alt={p.Nome}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => { e.target.src = "https://placehold.co/400x300?text=Peca"; }}
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] text-blue-600 font-black uppercase tracking-wider">
                        {p.Categoria || "Geral"}
                      </span>
                      <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                        EAN: {p.CodigoEAN}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 leading-tight">{p.Nome}</h2>
                    <p className="text-xs text-slate-500 mt-2 mb-4 line-clamp-2">{p.Descricao}</p>

                    <div className="mt-auto">
                      <div className="flex justify-between items-baseline mb-3">
                        <p className="text-xl font-black text-blue-600">€{p.PVP?.toFixed(2)}</p>
                        <p className={`text-[10px] font-medium italic ${esgotado ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                          {esgotado ? 'Esgotado' : `Stock: ${p.StockAtual}`}
                        </p>
                      </div>

                      {/* Botão / controlo de quantidade */}
                      {esgotado ? (
                        <button disabled className="w-full rounded-xl py-3 text-sm font-bold bg-slate-200 text-slate-400 cursor-not-allowed">
                          Indisponível
                        </button>
                      ) : qtd === 0 ? (
                        <button
                          onClick={() => adicionarAoCarrinho(p)}
                          className="w-full rounded-xl py-3 text-sm font-bold bg-slate-950 text-white hover:bg-slate-800 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <ShoppingCart size={16} /> Reservar
                        </button>
                      ) : (
                        <div className="flex items-center justify-between bg-slate-100 rounded-xl px-2 py-1">
                          <button
                            onClick={() => alterarQuantidade(p.CodigoEAN, -1)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-all"
                          >
                            <Minus className="w-4 h-4 text-slate-600" />
                          </button>
                          <span className="font-black text-slate-900 text-sm">{qtd}</span>
                          <button
                            onClick={() => alterarQuantidade(p.CodigoEAN, +1)}
                            disabled={qtd >= p.StockAtual}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white transition-all disabled:opacity-30"
                          >
                            <Plus className="w-4 h-4 text-slate-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full text-center py-10 text-slate-400">
              Nenhuma peça encontrada com estes critérios.
            </div>
          )}
        </section>
      </div>

     {/* ── Drawer do carrinho ─────────────────────────────────────────────── */}
    {carrinhoAberto && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4"> {/* Alterado: items-center e p-4 */}
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setCarrinhoAberto(false)}
        />

        {/* Painel */}
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-300 max-h-[80vh] flex flex-col overflow-hidden"> 
          {/* Alterado: rounded-3xl (em vez de rounded-t), zoom-in e overflow-hidden */}
          
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h3 className="font-black text-slate-900 text-lg">A tua reserva</h3>
              <p className="text-xs text-slate-400 font-medium">Pagamento no balcão ao levantar</p>
            </div>
            <button
              onClick={() => setCarrinhoAberto(false)}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Itens */}
          <div className="overflow-y-auto flex-1 p-6 space-y-4">
            {carrinho.length === 0 ? (
              <p className="text-center text-slate-300 font-bold py-8">O carrinho está vazio.</p>
            ) : (
              carrinho.map(({ peca, quantidade }) => (
                <div key={peca.CodigoEan} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={`../../../${peca.Imagem}`}
                      alt={peca.Nome}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://placehold.co/48x48?text=?"; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">{peca.Nome}</p>
                    <p className="text-xs text-slate-400">€{peca.PVP?.toFixed(2)} × {quantidade}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-slate-100 rounded-lg">
                      <button onClick={() => alterarQuantidade(peca.CodigoEAN, -1)} className="w-7 h-7 flex items-center justify-center">
                        <Minus className="w-3 h-3 text-slate-600" />
                      </button>
                      <span className="px-1 font-black text-sm text-slate-900">{quantidade}</span>
                      <button
                        onClick={() => alterarQuantidade(peca.CodigoEAN, +1)}
                        disabled={quantidade >= peca.StockAtual}
                        className="w-7 h-7 flex items-center justify-center disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3 text-slate-600" />
                      </button>
                    </div>
                    <button onClick={() => removerDoCarrinho(peca.CodigoEAN)} className="p-1.5 text-slate-300 hover:text-red-500 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer com total e botão */}
          {carrinho.length > 0 && (
            <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50/50">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500">Total estimado</span>
                <span className="font-black text-xl text-slate-900">€{totalPreco.toFixed(2)}</span>
              </div>
              <button
                onClick={handleConfirmarReserva}
                disabled={criarReservaMutation.isPending}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-black text-sm shadow-xl transition-all active:scale-[0.98] ${
                  criarReservaMutation.isPending
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-slate-950 hover:bg-black"
                }`}
              >
                {criarReservaMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {criarReservaMutation.isPending ? "A confirmar..." : "Confirmar Reserva"}
              </button>
            </div>
          )}
        </div>
      </div>
    )} 

      <BottomNav />
    </main>
  );
}