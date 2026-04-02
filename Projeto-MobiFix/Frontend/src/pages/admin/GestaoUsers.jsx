import { useState } from "react";
import { Plus, Edit, UserX, UserCheck, Shield, User, Mail, Phone, Wrench, Loader2 } from "lucide-react";
import { useFuncionarios, useCriarFuncionario, useAtualizarFuncionario } from "../../hooks/useFuncionarios";

const CARGO_LABELS = {
  ADMINISTRADOR: "Administrador",
  MECANICO: "Mecânico",
  OPERADOR: "Operador de Loja",
};

const CARGO_COLORS = {
  ADMINISTRADOR: "bg-purple-100 text-purple-700 border-purple-200",
  MECANICO: "bg-blue-100 text-blue-700 border-blue-200",
  OPERADOR: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const FORM_EMPTY = {
  numeroMecanografico: "",
  nome: "",
  email: "",
  contacto: "",
  cargo: "MECANICO",
  especialidade: "",
  password: "",
  ativo: true,
};

export default function UserManagement() {
  const { data: funcionarios = [], isLoading, isError } = useFuncionarios();
  const criarMutation = useCriarFuncionario();
  const atualizarMutation = useAtualizarFuncionario();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNumero, setEditingNumero] = useState(null);
  const [formData, setFormData] = useState(FORM_EMPTY);

  const isPending = criarMutation.isPending || atualizarMutation.isPending;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingNumero) {
      atualizarMutation.mutate(
        { numeroMecanografico: editingNumero, dados: formData },
        { onSuccess: handleCancel }
      );
    } else {
      criarMutation.mutate(formData, { onSuccess: handleCancel });
    }
  };

  const handleEdit = (func) => {
    setEditingNumero(func.NumeroMecanografico);
    setFormData({
      numeroMecanografico: func.NumeroMecanografico,
      nome: func.Nome,
      email: func.Email,
      contacto: func.Contacto,
      cargo: func.Cargo,
      especialidade: func.Especialidade ?? "",
      password: "",
      ativo: func.Ativo,
    });
    setIsFormOpen(true);
  };

  const handleToggleAtivo = (func) => {
    atualizarMutation.mutate({
      numeroMecanografico: func.NumeroMecanografico,
      dados: {
        nome: func.Nome,
        email: func.Email,
        contacto: func.Contacto,
        cargo: func.Cargo,
        especialidade: func.Especialidade ?? "",
        ativo: !func.Ativo,
      },
    });
  };

  const handleCancel = () => {
    setFormData(FORM_EMPTY);
    setIsFormOpen(false);
    setEditingNumero(null);
  };

  const field = (label, content) => (
    <div className="space-y-2">
      <label className="text-xs font-black uppercase text-slate-500">{label}</label>
      {content}
    </div>
  );

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-slate-100 outline-hidden focus:border-blue-500 bg-slate-50";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Equipa MobiFix</h1>
          <p className="text-lg font-medium text-slate-500">Gestão de colaboradores e permissões de acesso</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
        >
          <Plus className="w-5 h-5" /> Adicionar Funcionário
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total", value: funcionarios.length, icon: User, color: "blue" },
          { label: "Ativos", value: funcionarios.filter((f) => f.Ativo).length, icon: UserCheck, color: "emerald" },
          { label: "Inativos", value: funcionarios.filter((f) => !f.Ativo).length, icon: UserX, color: "red" },
        ].map((stat) => (
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
          <h2 className="text-2xl font-black text-slate-900 mb-6">
            {editingNumero ? "Atualizar Colaborador" : "Registar Colaborador"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Número Mecanográfico — só na criação */}
            {!editingNumero && field("Número Mecanográfico",
              <input
                type="text"
                required
                value={formData.numeroMecanografico}
                onChange={(e) => setFormData({ ...formData, numeroMecanografico: e.target.value })}
                placeholder="MECA001"
                className={inputClass}
              />
            )}

            {field("Nome Completo",
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className={inputClass}
              />
            )}

            {field("Email Profissional",
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClass}
              />
            )}

            {field("Contacto",
              <input
                type="tel"
                required
                maxLength={9}
                value={formData.contacto}
                onChange={(e) => setFormData({ ...formData, contacto: e.target.value.replace(/\D/g, "") })}
                placeholder="910000000"
                className={inputClass}
              />
            )}

            {field("Cargo",
              <select
                value={formData.cargo}
                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                className={inputClass}
              >
                <option value="MECANICO">Mecânico</option>
                <option value="OPERADOR">Operador de Loja</option>
                <option value="ADMINISTRADOR">Administrador</option>
              </select>
            )}

            {field("Especialidade (opcional)",
              <input
                type="text"
                value={formData.especialidade}
                onChange={(e) => setFormData({ ...formData, especialidade: e.target.value })}
                placeholder="ex: Baterias, Travões..."
                className={inputClass}
              />
            )}

            {/* Password — só na criação */}
            {!editingNumero && field("Password",
              <input
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className={inputClass}
              />
            )}

            {/* Ativo toggle — só na edição */}
            {editingNumero && (
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-500">Estado</label>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-slate-100 bg-slate-50">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <label htmlFor="ativo" className="text-sm font-bold text-slate-700 cursor-pointer">
                    Colaborador ativo
                  </label>
                </div>
              </div>
            )}

            <div className="md:col-span-2 flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isPending}
                className={`flex items-center gap-2 px-8 py-3 text-white font-black rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all ${
                  isPending ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingNumero ? "Guardar Alterações" : "Registar Colaborador"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="font-bold">A carregar colaboradores...</span>
          </div>
        ) : isError ? (
          <div className="py-20 text-center text-red-500 font-bold">
            Erro ao carregar funcionários. Verifica a ligação à API.
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <tr>
                <th className="px-6 py-4">Funcionário</th>
                <th className="px-6 py-4">Cargo</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Especialidade</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {funcionarios.map((func) => (
                <tr key={func.NumeroMecanografico} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-black text-xs uppercase shadow-md">
                        {func.Nome.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{func.Nome}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {func.Email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black border ${CARGO_COLORS[func.Cargo] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      {func.Cargo === "ADMINISTRADOR" && <Shield className="w-3 h-3" />}
                      {CARGO_LABELS[func.Cargo] ?? func.Cargo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-300" /> {func.Contacto}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {func.Especialidade ? (
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-slate-300" /> {func.Especialidade}
                      </div>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${func.Ativo ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                      {func.Ativo ? "● Ativo" : "○ Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(func)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleAtivo(func)}
                        disabled={atualizarMutation.isPending}
                        className={`p-2 rounded-lg transition-all ${
                          func.Ativo
                            ? "text-slate-400 hover:text-red-600 hover:bg-red-50"
                            : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                        }`}
                      >
                        {func.Ativo ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}