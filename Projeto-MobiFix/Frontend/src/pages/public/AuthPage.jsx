import { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom'; // Se usares router, senão usa <a>
import { useLocation } from 'react-router';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const location = useLocation(); // Hook para ler o estado vindo do Header

  useEffect(() => {
    if (location.state?.mode === 'register') {
      setIsLogin(false);
    } else if (location.state?.mode === 'login') {
      setIsLogin(true);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white selection:bg-safety-orange selection:text-white">
      
      {/* LADO ESQUERDO: Visual / Branding (Oculto em Mobile) */}
      <div className="hidden lg:flex relative bg-deep-slate items-center justify-center p-12 overflow-hidden">
        {/* Background Decorativo */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-corporate-blue rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-safety-orange rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-md text-center">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-corporate-blue flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-black italic">M</span>
            </div>
            <span className="text-4xl font-black text-white tracking-tighter">MobiFix</span>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            {isLogin ? 'Bem-vindo de volta à revolução urbana.' : 'Junte-se à maior rede de micromobilidade.'}
          </h2>
          <p className="text-slate-400 text-lg">
            {isLogin 
              ? 'Aceda à sua conta para gerir as suas reservas e histórico de reparações.' 
              : 'Crie a sua conta hoje e comece a usufruir de peças exclusivas e assistência prioritária.'}
          </p>

          {/* Lista de Benefícios (Apenas no Registo) */}
          {!isLogin && (
            <div className="mt-10 space-y-4 text-left inline-block">
              {['Reservas Instantâneas', 'Histórico Digital', 'Descontos Premium'].map((text) => (
                <div key={text} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="text-safety-orange" size={20} />
                  <span className="font-medium">{text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* LADO DIREITO: Formulário */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-20 relative">
        
        {/* Botão Voltar */}
        <a href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-deep-slate transition-colors font-bold text-sm">
          <ArrowLeft size={18} /> Voltar ao Início
        </a>

        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-deep-slate mb-2">
              {isLogin ? 'Login de Cliente' : 'Criar Conta Cliente'}
            </h1>
            <p className="text-slate-500">
              {isLogin ? 'Introduza os seus dados para entrar.' : 'Preencha o formulário para se registar.'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-deep-slate mb-2">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="João Silva"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-corporate-blue focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-deep-slate mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email" 
                  placeholder="exemplo@email.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-corporate-blue focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-deep-slate mb-2">Palavra-passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-corporate-blue focus:outline-none transition-all"
                />
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-sm font-bold text-corporate-blue hover:underline">Esqueceu-se da password?</button>
              </div>
            )}

            <button className="w-full bg-deep-slate hover:bg-black text-white font-bold py-4 rounded-xl shadow-xl transition-all active:scale-[0.98] cursor-pointer mt-4">
              {isLogin ? 'Entrar' : 'Finalizar Registo'}
            </button>
          </form>

          {/* Toggle entre Login e Sign Up */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 font-medium">
              {isLogin ? 'Ainda não tem conta?' : 'Já faz parte da MobiFix?'}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-safety-orange font-bold hover:underline cursor-pointer"
              >
                {isLogin ? 'Registe-se aqui' : 'Faça login agora'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}