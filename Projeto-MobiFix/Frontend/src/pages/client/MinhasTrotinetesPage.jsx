import  Header  from "../../components/Header";
import  BottomNav  from "../../components/BottomNav";
import { Wrench, Scooter } from "lucide-react";

export default function Trotinetes() {
  const trotinetes = [
    {
      id: "1",
      model: "Xiaomi Mi Pro 2",
      serial: "XM2023-4567",
      status: "Em Reparação",
      battery: 75,
    },
    {
      id: "2",
      model: "Segway Ninebot Max",
      serial: "SG2023-8901",
      status: "Pronta",
    },
    {
      id: "3",
      model: "Xiaomi Essential",
      serial: "XM2023-1234",
      status: null,
    },
  ];

  const statusConfig = {
    "Em Reparação": "bg-orange-100 text-orange-700 border-orange-200",
    "Pronta": "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-28">
      <Header title="Minhas Trotinetes" />

      <div className="p-5 space-y-4">
        {trotinetes.map((t) => (
          <section 
            key={t.id} 
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 transition-all active:bg-slate-50"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                  <Scooter className={`w-5 h-5 ${t.status === 'Em Reparação' ? 'text-orange-500' : 'text-slate-400'}`} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">{t.model}</h3>
                  <p className="text-xs font-mono text-slate-400 mt-1">{t.serial}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wider ${statusConfig[t.status]}`}>
                {t.status}
              </span>
            </div>
            
            {t.status === "Em Reparação" && (
              <div className="flex items-center gap-2 py-2 px-1 bg-orange-50/50 rounded-lg border border-orange-100/50">
                <Wrench className="w-3.5 h-3.5 text-orange-500 ml-2" />
                <span className="text-xs text-orange-800 font-medium">
                  Previsão de conclusão: 3-5 dias úteis
                </span>
              </div>
            )}
            {t.status === "Pronta" && (
              <div className="flex items-center gap-2 py-2 px-1 bg-orange-50/50 rounded-lg border border-orange-100/50">
                <Wrench className="w-3.5 h-3.5 text-green-500 ml-2" />
                <span className="text-xs text-green-800 font-medium">
                  Pronta para Levantamento
                </span>
              </div>

            )}
          </section>
        ))}
      </div>

      <BottomNav />
    </main>
  );
}