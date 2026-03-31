import React, { useState } from "react";
import { User, Lock, Eye, EyeOff, Loader2 } from "lucide-react"; // Adicionei Loader2 para o loading
import { useNavigate } from "react-router-dom"; // Para redirecionar após login
import { useLoginFuncionario } from "../../hooks/useAuth";
import ForgotPassword from "./ForgotPassword";
import LogoFixNRide from "../../assets/fixnride_logo.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState(""); // Este é o Número Mecanográfico
  const [password, setPassword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Inicializar o hook de mutação
  const { mutate, isPending } = useLoginFuncionario();

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(
      { numeroMecanografico: username, password },
      {
        onSuccess: (data) => {
          // Redirecionamento baseado no cargo (role) que vem da API
          const role = data.cargo;
          
          if (role === 'Administrador') {
            navigate('/FixNManage/dashboard');
          } else if (role === 'Operador') {
            navigate('/FixNSell/vendadireta');
          } else if (role === 'Mecanico') {
            navigate('/FixNRepair/diagnosticos');
          } else {
            navigate('/'); // Fallback
          }
        }
      }
    );
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-gray-800 via-gray-900 to-slate-800 p-4">
      {/* Background Patterns (Mantidos iguais...) */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)` }} />
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.2) 2%, transparent 0%)`, backgroundSize: "100px 100px" }} />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl transition-all">
        <div className="flex justify-center mb-6">
          <img src={LogoFixNRide} alt="FixNRide Logo" className="h-24 w-auto block mx-auto" />
        </div>
        
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">Staff Portal</h1>
          <p className="mt-1 text-sm text-gray-500">Introduza as suas credenciais para aceder</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username / Mecanográfico */}
          <div className="group">
            <label htmlFor="username" className="mb-2 block text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-blue-600">
              Número Mecanográfico
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                id="username"
                disabled={isPending}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pr-3 pl-10 text-gray-900 outline-hidden ring-blue-500/20 transition-all focus:border-blue-500 focus:ring-4 disabled:opacity-50"
                placeholder="Ex: ADM001"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="group">
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-blue-600">
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                disabled={isPending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pr-10 pl-10 text-gray-900 outline-hidden ring-blue-500/20 transition-all focus:border-blue-500 focus:ring-4 disabled:opacity-50"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-hidden"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={() => setModalOpen(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
            >
              Esqueceu a password?
            </button>
          </div>

          {/* Login Button com Loading State */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 cursor-pointer rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                A entrar...
              </>
            ) : (
              "Entrar no Dashboard"
            )}
          </button>
        </form>

        <footer className="mt-8 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            © {new Date().getFullYear()} MobiFix Lda
          </p>
        </footer>
        
        <ForgotPassword isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </div>
  );
}