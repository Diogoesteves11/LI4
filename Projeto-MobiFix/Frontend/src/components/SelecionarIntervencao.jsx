import { useState } from 'react';
import { ClipboardList, Plus, X, Search } from 'lucide-react';
import { categories, interventionCatalog } from '../data/mockData.js';

export function InterventionSelector({
  selectedInterventions,
  onAddIntervention,
  onRemoveIntervention
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showCatalog, setShowCatalog] = useState(false);

  const filteredInterventions = interventionCatalog.filter((intervention) => {
    const matchesSearch =
      intervention.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intervention.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todos' || intervention.category === selectedCategory;
    const notSelected = !selectedInterventions.find(i => i.id === intervention.id);
    
    return matchesSearch && matchesCategory && notSelected;
  });

  const totalEstimatedTime = selectedInterventions.reduce(
    (sum, intervention) => sum + intervention.estimatedTime,
    0
  );

  return (
    <div className="rounded-xl border-2 border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-slate-900">Intervenções Selecionadas</h3>
        </div>
        <button
          onClick={() => setShowCatalog(!showCatalog)}
          className="flex h-12 cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-6 font-semibold text-white transition-colors hover:bg-blue-700 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Adicionar Intervenção
        </button>
      </div>

      {selectedInterventions.length > 0 ? (
        <div className="mb-4 space-y-3">
          {selectedInterventions.map((intervention) => (
            <div
              key={intervention.id}
              className="flex items-center justify-between rounded-lg border-2 border-blue-200 bg-linear-to-r from-blue-50 to-slate-50 p-4"
            >
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-3">
                  <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-xs text-white">
                    {intervention.code}
                  </span>
                  <span className="text-lg font-bold text-slate-900">
                    {intervention.name}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span className="font-semibold">{intervention.category}</span>
                  <span>•</span>
                  <span>{intervention.estimatedTime} min</span>
                  {intervention.requiresParts && (
                    <>
                      <span>•</span>
                      <span className="font-semibold text-amber-600">Requer peças</span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => onRemoveIntervention(intervention.id)}
                className="ml-4 flex h-9 w-9 items-center justify-center rounded-md text-red-600 transition-colors hover:bg-red-50 hover:text-red-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
          
          <div className="flex items-center justify-between border-t-2 border-slate-200 pt-4">
            <span className="font-semibold text-slate-700">Tempo Total Estimado:</span>
            <span className="rounded-full bg-blue-600 px-4 py-2 text-lg font-bold text-white">
              {totalEstimatedTime} minutos
            </span>
          </div>
        </div>
      ) : (
        <div className="mb-4 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 py-12 text-slate-400">
          <p>Nenhuma intervenção selecionada</p>
        </div>
      )}

      {showCatalog && (
        <div className="mt-6 rounded-lg border-2 border-blue-200 bg-slate-50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-900">Catálogo de Intervenções</h4>
            <button 
              onClick={() => setShowCatalog(false)}
              className="text-slate-600 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar intervenção..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 w-full rounded-lg border-2 border-slate-200 bg-white pl-10 pr-4 outline-hidden transition-all focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300">
              <div className="space-y-2">
                {filteredInterventions.map((intervention) => (
                  <div
                    key={intervention.id}
                    className="group flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white p-3 transition-all hover:border-blue-400 hover:shadow-md"
                    onClick={() => onAddIntervention(intervention)}
                  >
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="rounded border border-slate-200 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-500">
                          {intervention.code}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {intervention.name}
                        </span>
                      </div>
                      <div className="text-sm text-slate-500">
                        {intervention.category} • {intervention.estimatedTime} min
                      </div>
                    </div>
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-md bg-green-600 text-white opacity-0 transition-opacity hover:bg-green-700 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddIntervention(intervention);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}