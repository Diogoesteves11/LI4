import { Scooter, Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";

const categories = ["Todas", "Bateria", "Rodas", "Travões", "Motor", "Eletrónica", "Acessórios"];

const products = [
  {
    id: "1",
    category: "Bateria",
    name: "Bateria 36V 10.4Ah",
    description: "Bateria de lítio compatível com Xiaomi Mi Pro 2 e Essential",
    price: 89.99,
    stock: 5,
    compatibilidade: ["Xiaomi Mi Pro 2", "Xiaomi Essential"],
    imageUrl: "https://images.unsplash.com/photo-1762769916488-8b4ec3109663?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: "2",
    category: "Bateria",
    name: "Bateria Extra 36V",
    description: "Bateria de lítio compatível com modelos Segway Ninebot",
    price: 115.00,
    stock: 2,
    compatibilidade: ["Segway Ninebot Max"],
    imageUrl: "https://images.unsplash.com/photo-1762769916488-8b4ec3109663?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  // Podes adicionar mais aqui...
];

export default function Catalogo() {
  const [activeFilter, setActiveFilter] = useState("Bateria");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main className="min-h-screen bg-slate-50 pb-28">
      <Header title="Catálogo de Peças" showBack />
      
      <div className="p-5">
        {/* Banner de Informação */}
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex gap-3 shadow-sm">
          <Scooter className="text-blue-600 shrink-0" size={18} />
          <p className="text-xs text-blue-800 leading-relaxed font-medium">
            Reserve peças para levantar na loja.
          </p>
        </section>

        {/* Barra de Pesquisa */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar peças..."
            className="w-full bg-slate-100 border border-slate-200 rounded-full px-5 pl-11 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all shadow-inner"
          />
        </div>

        {/* Filtros de Categoria */}
        <section className="mb-8 overflow-x-auto">
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

        {/* 4. Grade de Produtos - ONDE A MÁGICA ACONTECE */}
        {/* Usamos 'grid-cols-1' para mobile, 'sm:grid-cols-2' para tablets e 'lg:grid-cols-3' para PC */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <article 
              key={p.id} 
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100/50 flex flex-col h-full"
            >
              {/* Imagem com tamanho fixo e aspecto rácio definido */}
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={p.imageUrl} 
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  {p.category}
                </span>
                
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  {p.name}
                </h2>
                
                <p className="text-xs text-slate-500 mt-2 mb-4 line-clamp-2">
                  {p.description}
                </p>

                {/* Preço e Stock - Empurrados para o fundo do card */}
                <div className="mt-auto">
                  <div className="flex justify-between items-baseline mb-3">
                    <p className="text-xl font-black text-blue-600">
                      €{p.price.toFixed(2)}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium italic">
                      Stock: {p.stock}
                    </p>
                  </div>

                  {/* Compatibilidade */}
                  <div className="flex flex-wrap gap-1 mb-5">
                    {p.compatibilidade.slice(0, 2).map((c) => (
                      <span key={c} className="text-[9px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-md border border-slate-100">
                        {c}
                      </span>
                    ))}
                  </div>

                  <button className="w-full bg-slate-950 text-white rounded-xl py-3 text-sm font-bold shadow-lg hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <ShoppingCart size={16} />
                    Reservar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>

     <BottomNav />
    </main>
  );
}