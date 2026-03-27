import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Clock, Euro, TrendingUp, Wrench, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AdminDashboard() {
  const repairTimeData = [
    { mes: "Jan", tempo: 2.5 }, { mes: "Fev", tempo: 2.8 }, { mes: "Mar", tempo: 2.3 },
    { mes: "Abr", tempo: 2.6 }, { mes: "Mai", tempo: 2.4 }, { mes: "Jun", tempo: 2.2 },
  ];

  const revenueData = [
    { name: "Mão-de-Obra", value: 65000, color: "#2563eb" },
    { name: "Peças", value: 45000, color: "#10b981" },
  ];

  const stats = [
    { name: "Tempo Médio", value: "2.4h", icon: Clock, change: "-8%", trend: "up", color: "blue" },
    { name: "Faturação", value: "€110k", icon: Euro, change: "+12%", trend: "up", color: "emerald" },
    { name: "Concluídas", value: "247", icon: Wrench, change: "+18%", trend: "up", color: "indigo" },
    { name: "Crescimento", value: "15.2%", icon: TrendingUp, change: "+3%", trend: "up", color: "purple" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Dashboard Executivo</h1>
        <p className="text-lg font-medium text-slate-500">Métricas operacionais e financeiras em tempo real</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="group bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 group-hover:bg-${stat.color}-600 transition-colors`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 group-hover:text-white`} />
              </div>
              <div className="flex items-center gap-1 text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3" /> {stat.change}
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.name}</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Repair Time Bar Chart */}
        <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" /> Eficiência Operacional (h)
          </h2>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={repairTimeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="tempo" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Pie Chart */}
        <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-sm flex flex-col">
          <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
            <Euro className="w-5 h-5 text-emerald-600" /> Origem da Faturação
          </h2>
          <div className="flex-1 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value">
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
            {revenueData.map((item) => (
              <div key={item.name} className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">{item.name}</span>
                </div>
                <span className="text-xl font-black text-slate-900">€{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}