import { useState } from 'react';
import { Barcode, Scan, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export function EANScanner({ parts, onAddPart, onRemovePart }) {
  const [eanCode, setEanCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const partDatabase = {
    '7891234567890': { name: 'Pneu Xiaomi 8.5" Standard' },
    '7891234567891': { name: 'Bateria 36V 10Ah Li-ion' },
    '7891234567892': { name: 'Pastilhas Travão Disco' },
    '7891234567893': { name: 'Motor Brushless 350W' },
    '7891234567894': { name: 'Controlador 36V 15A' },
    '7891234567895': { name: 'Display LCD Digital' },
    '7891234567896': { name: 'Cabo Travão Dianteiro' },
    '7891234567897': { name: 'Guiador Dobrável Alumínio' },
    '7891234567898': { name: 'Amortecedor Traseiro' },
    '7891234567899': { name: 'LED Frontal 1W' },
    '7891234567800': { name: 'Carregador 42V 2A' },
  };

  const handleScanSimulation = () => {
    setIsScanning(true);
    setTimeout(() => {
      const keys = Object.keys(partDatabase);
      const randomEAN = keys[Math.floor(Math.random() * keys.length)];
      setEanCode(randomEAN);
      setIsScanning(false);
      toast.success('Código EAN lido com sucesso!');
    }, 1200);
  };

  const handleAddPart = () => {
    if (!eanCode) {
      toast.error('Insira um código EAN');
      return;
    }

    const partInfo = partDatabase[eanCode];
    if (!partInfo) {
      toast.error('Peça não encontrada');
      return;
    }

    const existingPart = parts.find(p => p.ean === eanCode);
    if (existingPart) {
      onAddPart({
        ...existingPart,
        quantity: existingPart.quantity + 1,
        timestamp: new Date().toISOString()
      });
    } else {
      onAddPart({
        ean: eanCode,
        name: partInfo.name,
        quantity: 1,
        timestamp: new Date().toISOString()
      });
    }

    setEanCode('');
  };

  return (
    <div className="p-6 border-2 border-slate-200 rounded-2xl bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Barcode className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-slate-900">Scanner de Peças (EAN)</h3>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Código EAN (ex: 7891234567890)"
            value={eanCode}
            onChange={(e) => setEanCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPart()}
            className="flex-1 h-14 px-4 text-lg font-mono rounded-xl border-2 border-slate-200 focus:border-blue-500 outline-hidden transition-all"
          />
          <div className="flex gap-2">
            <button
              onClick={handleScanSimulation}
              disabled={isScanning}
              className="flex-1 md:flex-none h-14 px-6 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all disabled:opacity-50 active:scale-95"
            >
              <Scan className={`w-5 h-5 ${isScanning ? 'animate-pulse' : ''}`} />
              {isScanning ? 'A Ler...' : 'Scanner'}
            </button>
            <button
              onClick={handleAddPart}
              disabled={!eanCode}
              className="flex-1 md:flex-none h-14 px-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Adicionar
            </button>
          </div>
        </div>

        {parts.length > 0 ? (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-slate-700">Peças Instaladas ({parts.length})</span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Stock em tempo real</span>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
              {parts.map((part) => (
                <div
                  key={part.ean}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 group hover:border-blue-200 transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-900">{part.name}</div>
                    <div className="text-xs font-mono text-slate-500 mt-0.5">EAN: {part.ean}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-sm shadow-blue-100">
                      x{part.quantity}
                    </span>
                    <button
                      onClick={() => onRemovePart(part.ean)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-xl">
            <p className="text-slate-400 font-medium">Nenhuma peça registada nesta intervenção</p>
          </div>
        )}
      </div>
    </div>
  );
}