import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, Trash2, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import Faturacao from '../../components/Faturacao';
import { usePecas } from "../../hooks/usePecas"; // Importação do hook

export default function VendaDireta() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showFaturacao, setShowFaturacao] = useState(false);

  const { data: pecas, isLoading, isError } = usePecas();

  const filteredProducts = useMemo(() => {
    if (!pecas) return [];

    return pecas.filter((p) => {
      const category = p.nome ? p.nome.split(" ")[0] : "Geral";
      const matchesSearch = 
        p.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ean?.includes(searchTerm);

      return matchesSearch;
    });
  }, [pecas, searchTerm]);

  // 3. Lógica do Carrinho (ajustada para usar 'ean' como ID único)
  const addToCart = (product) => {
    const existing = cart.find((item) => item.ean === product.ean);
    if (existing) updateQuantity(product.ean, existing.quantity + 1);
    else setCart([...cart, { ...product, quantity: 1 }]);
  };

  const updateQuantity = (ean, qty) => {
    const product = pecas.find(p => p.ean === ean);
    if (qty <= 0) return removeFromCart(ean);
    
    setCart(cart.map((item) => 
      item.ean === ean 
        ? { ...item, quantity: Math.min(qty, product?.stockAtual || 0) } 
        : item
    ));
  };

  const removeFromCart = (ean) => setCart(cart.filter((item) => item.ean !== ean));
  
  // Total calculado usando 'pvp'
  const totalAmount = cart.reduce((sum, item) => sum + item.pvp * item.quantity, 0);

  // Estados de carregamento e erro
  if (isLoading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
        <p className="text-slate-500">A carregar inventário...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-8 bg-red-50 border border-red-100 rounded-2xl flex flex-col items-center">
        <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
        <p className="text-red-700 font-bold">Erro ao ligar ao servidor</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-sm text-red-600 underline">Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-900">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Venda Direta</h2>
        <p className="text-slate-500">Gestão de ponto de venda e stock em tempo real</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Catálogo */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold mb-4">Produtos em Stock</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome, categoria ou EAN..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.ean} className="p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-300 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-slate-800">{product.nome}</h4>
                        <span className="inline-block px-2 py-1 mt-1 text-[10px] font-semibold bg-slate-100 text-slate-500 rounded-md uppercase">
                          {product.nome}
                        </span>
                      </div>
                      <span className="text-lg font-black text-blue-600">€{product.pvp?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className='text-slate-400'>
                        Stock: {product.stockAtual}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stockAtual <= 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-bold ${
                          product.stockAtual > 0 
                          ? "bg-slate-900 text-white hover:bg-blue-600 cursor-pointer" 
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        <Plus className="h-4 w-4" /> {product.stockAtual > 0 ? "Adicionar" : "Esgotado"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <p className="text-center text-slate-400 py-10">Nenhum produto encontrado.</p>
              )}
            </div>
          </div>
        </div>

        {/* Carrinho Lateral */}
        <div className="relative">
          <div className="sticky top-8 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-bold">Resumo da Venda</h3>
            </div>

            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Trash2 className="h-8 w-8" />
                  </div>
                  <p className="text-slate-400 font-medium">O carrinho está vazio</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {cart.map((item) => (
                      <div key={item.ean} className="flex flex-col gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-sm font-bold text-slate-700 leading-tight">{item.nome}</span>
                          <button onClick={() => removeFromCart(item.ean)} className="text-slate-300 hover:text-red-500 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border bg-white rounded-lg p-1">
                            <button onClick={() => updateQuantity(item.ean, item.quantity - 1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Minus className="h-3 w-3" /></button>
                            <span className="w-8 text-center text-xs font-bold tabular-nums">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.ean, item.quantity + 1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Plus className="h-3 w-3" /></button>
                          </div>
                          <span className="font-bold text-slate-900">€{(item.pvp * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-end mb-6">
                      <span className="text-slate-500 font-medium uppercase text-xs tracking-widest">Total Bruto</span>
                      <span className="text-3xl font-black text-blue-600">€{totalAmount.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => setShowFaturacao(true)}
                      className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
                    >
                      Pagar Agora
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showFaturacao && (
        <Faturacao
          amount={totalAmount}
          items={cart}
          onClose={() => setShowFaturacao(false)}
          onComplete={() => {
            setCart([]);
            setShowFaturacao(false);
          }}
        />
      )}
    </div>
  );
}