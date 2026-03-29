import { Lock, ShoppingBag, Eye } from 'lucide-react';

const parts = [
  {
    id: 1,
    title: 'Premium E-Bike Battery',
    price: '149.99€',
    image: 'https://images.unsplash.com/photo-1579117668079-bc683eb1c57c?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 2,
    title: 'All-Terrain Tire Set',
    price: '89.99€',
    image: 'https://images.unsplash.com/photo-1594399829399-330e4bfe6c70?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 3,
    title: 'Hydraulic Brake Pads',
    price: '34.99€',
    image: 'https://images.unsplash.com/photo-1656232976683-7b688560e427?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 4,
    title: 'Reinforced Chain Kit',
    price: '54.99€',
    image: 'https://images.unsplash.com/photo-1758470132700-02d7371a70c2?auto=format&fit=crop&q=80&w=600',
  },
  // ... podes adicionar os restantes aqui
];

export default function FeaturedParts() {
  // Simulação de estado (No futuro, isto viria de um AuthContext)
  const isLoggedIn = false;

  return (
    <section className="py-24 bg-light-gray" id="parts-catalog">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-black text-deep-slate mb-4 tracking-tight">
            Featured Parts <span className="text-corporate-blue">Catalog</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Explore a nossa seleção premium de componentes para veículos de micromobilidade. 
            Qualidade garantida pela MobiFix.
          </p>
        </div>

        {/* Parts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {parts.map((part) => (
            <div
              key={part.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100"
            >
              {/* Product Image Container */}
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <img
                  src={part.image}
                  alt={part.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-md text-deep-slate text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-widest">
                    MobiFix Original
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-deep-slate mb-1 group-hover:text-corporate-blue transition-colors">
                  {part.title}
                </h3>
                <p className="text-2xl font-black text-corporate-blue mb-6">
                  {part.price}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-slate-100 text-deep-slate font-bold text-sm hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer">
                    <Eye size={18} />
                    Ver Detalhes
                  </button>

                  {/* Dynamic Reserve Button */}
                  <button
                    disabled={!isLoggedIn}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg cursor-pointer active:scale-95 ${
                      isLoggedIn
                        ? 'bg-safety-orange text-white hover:bg-orange-600 shadow-orange-500/20'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    {isLoggedIn ? (
                      <>
                        <ShoppingBag size={18} />
                        Reservar Peça
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        Login para Reservar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ver Mais Link */}
        <div className="mt-16 text-center">
           <a href="/catalog" className="inline-flex items-center gap-2 text-corporate-blue font-bold hover:gap-4 transition-all">
             Ver Catálogo Completo 
             <span className="text-xl">→</span>
           </a>
        </div>
      </div>
    </section>
  );
}