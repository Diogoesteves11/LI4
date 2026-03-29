import React, { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import ForgotPassword from "./ForgotPassword";

import LogoFixNRide from "../../assets/fixnride_logo.png";

// --- Componente Principal ---
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt with:", { username, password });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-gray-800 via-gray-900 to-slate-800 p-4">
      
      {/* Background Pattern 1: Linhas Diagonais */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,.05) 10px,
            rgba(255,255,255,.05) 20px
          )`,
        }}
      />

      {/* Background Pattern 2: Pontos (Radial) */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 0%),
                           radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.2) 2%, transparent 0%)`,
          backgroundSize: "100px 100px",
        }}
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl transition-all">
        <div className="flex justify-center mb-6">
          <img 
            src={LogoFixNRide} 
            alt="FixNRide Logo" 
            className="h-24 w-auto block mx-auto" 
          />
        </div>
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">
            Staff Portal
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Introduza as suas credenciais para aceder
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="group">
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-blue-600"
            >
              Mecanográfico Number
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pr-3 pl-10 text-gray-900 outline-hidden ring-blue-500/20 transition-all focus:border-blue-500 focus:ring-4"
                placeholder="Ex: 12345"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="group">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700 transition-colors group-focus-within:text-blue-600"
            >
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pr-10 pl-10 text-gray-900 outline-hidden ring-blue-500/20 transition-all focus:border-blue-500 focus:ring-4"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-hidden"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 transition-colors" />
                ) : (
                  <Eye className="h-5 w-5 transition-colors" />
                )}
              </button>
            </div>
          </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
            <button 
                type="button" // Essencial para não dar refresh à página
                onClick={() => setModalOpen(true)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
            >
                Esqueceu a password?
            </button>
            </div>
          {/* Login Button */}
          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
          >
            Entrar no Dashboard
          </button>
        </form>

        <footer className="mt-8 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            © {new Date().getFullYear()} MobiFix Lda
          </p>
        </footer>
        <ForgotPassword 
            isOpen={modalOpen} 
            onClose={() => setModalOpen(false)} 
        />
      </div>
    </div>
  );
}