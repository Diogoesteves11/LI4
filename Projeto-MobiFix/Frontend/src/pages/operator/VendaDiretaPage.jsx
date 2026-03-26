import React, { useState } from 'react';
import { Search, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import Faturacao from '../../components/Faturacao';

const mockProducts = [
  { id: '1', name: 'Jantes de Xiaomi Mi Pro 2', category: 'Acessórios', price: 99.99, stock: 12 },
  { id: '2', name: 'Rodas Ninebot Max G30', category: 'Acessórios', price: 49.99, stock: 8 },
  { id: '3', name: 'Capacete Urban Pro', category: 'Acessórios', price: 39.99, stock: 25 },
  { id: '4', name: 'Luzes LED Pack', category: 'Acessórios', price: 19.99, stock: 40 },
  { id: '5', name: 'Cadeado Anti-Furto', category: 'Acessórios', price: 29.99, stock: 30 },
  { id: '6', name: 'Pneu Traseiro Xiaomi', category: 'Peças', price: 24.99, stock: 15 },
  { id: '7', name: 'Bateria Extra Ninebot', category: 'Peças', price: 199.99, stock: 5 },
  { id: '8', name: 'Mochila Transporte', category: 'Acessórios', price: 49.99, stock: 18 },
];

export default function VendaDireta() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showFaturacao, setShowFaturacao] = useState(false);

  const filteredProducts = mockProducts.filter(
    (p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) updateQuantity(product.id, existing.quantity + 1);
    else setCart([...cart, { ...product, quantity: 1 }]);
  };

  const updateQuantity = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity: Math.min(qty, item.stock) } : item)));
  };

  const removeFromCart = (id) => setCart(cart.filter((item) => item.id !== id));
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
              <h3 className="text-xl font-bold mb-4">Produtos</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome ou categoria..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-300 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-slate-800">{product.name}</h4>
                        <span className="inline-block px-2 py-1 mt-1 text-xs font-semibold bg-slate-100 text-slate-500 rounded-md uppercase">
                          {product.category}
                        </span>
                      </div>
                      <span className="text-lg font-black text-blue-600">€{product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${product.stock < 5 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                        Stock: {product.stock}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer text-sm font-bold"
                      >
                        <Plus className="h-4 w-4" /> Adicionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
                      <div key={item.id} className="flex flex-col gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-sm font-bold text-slate-700 leading-tight">{item.name}</span>
                          <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border bg-white rounded-lg p-1">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Minus className="h-3 w-3" /></button>
                            <span className="w-8 text-center text-xs font-bold tabular-nums">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Plus className="h-3 w-3" /></button>
                          </div>
                          <span className="font-bold text-slate-900">€{(item.price * item.quantity).toFixed(2)}</span>
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