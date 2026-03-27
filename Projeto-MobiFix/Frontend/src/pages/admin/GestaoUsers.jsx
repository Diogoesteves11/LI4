import { useState } from "react";
import { Plus, Edit, UserX, UserCheck, Shield, User, Mail, Calendar } from "lucide-react";

export default function UserManagement() {
  const [employees, setEmployees] = useState([
    { id: "1", nome: "João Silva", email: "joao.silva@mobifix.pt", cargo: "admin", ativo: true, dataAdmissao: "2024-01-15" },
    { id: "2", nome: "Maria Santos", email: "maria.santos@mobifix.pt", cargo: "tecnico", ativo: true, dataAdmissao: "2024-03-20" },
    { id: "3", nome: "Pedro Costa", email: "pedro.costa@mobifix.pt", cargo: "tecnico", ativo: true, dataAdmissao: "2024-06-10" },
    { id: "4", nome: "Ana Rodrigues", email: "ana.rodrigues@mobifix.pt", cargo: "atendimento", ativo: true, dataAdmissao: "2025-01-05" },
    { id: "5", nome: "Carlos Mendes", email: "carlos.mendes@mobifix.pt", cargo: "tecnico", ativo: false, dataAdmissao: "2023-11-20" },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    cargo: "tecnico",
    dataAdmissao: "",
  });

  const cargoLabels = { admin: "Administrador", tecnico: "Mecânico", atendimento: "Operador de Loja" };
  const cargoColors = { 
    admin: "bg-purple-100 text-purple-700 border-purple-200", 
    tecnico: "bg-blue-100 text-blue-700 border-blue-200", 
    atendimento: "bg-emerald-100 text-emerald-700 border-emerald-200" 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setEmployees(employees.map((emp) => emp.id === editingId ? { ...emp, ...formData } : emp));
    } else {
      setEmployees([...employees, { id: Date.now().toString(), ...formData, ativo: true }]);
    }
    handleCancel();
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setFormData({ nome: emp.nome, email: emp.email, cargo: emp.cargo, dataAdmissao: emp.dataAdmissao });
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setFormData({ nome: "", email: "", cargo: "tecnico", dataAdmissao: "" });
    setIsFormOpen(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Equipa MobiFix</h1>
          <p className="text-lg font-medium text-slate-500">Gestão de colaboradores e permissões de acesso</p>
        </div>
        <button onClick={() => setIsFormOpen(true)} className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200">
          <Plus className="w-5 h-5" /> Adicionar Funcionário
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total", value: employees.length, icon: User, color: "blue" },
          { label: "Ativos", value: employees.filter(e => e.ativo).length, icon: UserCheck, color: "emerald" },
          { label: "Inativos", value: employees.filter(e => !e.ativo).length, icon: UserX, color: "red" }
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`bg-${stat.color}-100 p-3 rounded-xl`}>
                <stat.icon className={`w-7 h-7 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      {isFormOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-500/20 p-8 animate-in slide-in-from-top-4">
          <h2 className="text-2xl font-black text-slate-900 mb-6">{editingId ? "Atualizar Perfil" : "Registar Colaborador"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-500">Nome Completo</label>
              <input type="text" required value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 outline-hidden focus:border-blue-500 bg-slate-50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-500">Email Profissional</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 outline-hidden focus:border-blue-500 bg-slate-50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-500">Cargo</label>
              <select value={formData.cargo} onChange={(e) => setFormData({...formData, cargo: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 outline-hidden focus:border-blue-500 bg-slate-50">
                <option value="tecnico">Técnico</option>
                <option value="atendimento">Atendimento</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-500">Data de Admissão</label>
              <input type="date" required value={formData.dataAdmissao} onChange={(e) => setFormData({...formData, dataAdmissao: e.target.value})} className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 outline-hidden focus:border-blue-500 bg-slate-50" />
            </div>
            <div className="md:col-span-2 flex gap-3 pt-4">
              <button type="submit" className="px-8 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95 transition-all">Salvar Colaborador</button>
              <button type="button" onClick={handleCancel} className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <tr>
              <th className="px-6 py-4">Funcionário</th>
              <th className="px-6 py-4">Cargo</th>
              <th className="px-6 py-4">Admissão</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-black text-xs uppercase shadow-md">{emp.nome.charAt(0)}</div>
                    <div>
                      <div className="font-bold text-slate-900">{emp.nome}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {emp.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black border ${cargoColors[emp.cargo]}`}>
                    {emp.cargo === "admin" && <Shield className="w-3 h-3" />} {cargoLabels[emp.cargo]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-300" /> {new Date(emp.dataAdmissao).toLocaleDateString("pt-PT")}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${emp.ativo ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                    {emp.ativo ? "● Ativo" : "○ Inativo"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleEdit(emp)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                    <button 
                      onClick={() => setEmployees(employees.map(e => e.id === emp.id ? {...e, ativo: !e.ativo} : e))}
                      className={`p-2 rounded-lg transition-all ${emp.ativo ? "text-slate-400 hover:text-red-600 hover:bg-red-50" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"}`}
                    >
                      {emp.ativo ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}