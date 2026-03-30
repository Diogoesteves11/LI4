import React, { useState } from 'react';

const ForgotPassword = ({ isOpen, onClose }) => {
  const [mecanografico, setMecanografico] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui ligarias à tua API .NET: POST /api/auth/recover
    console.log("Pedido de recuperação para:", mecanografico);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setMecanografico('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-slate-100">
        
        {/* Header Decorativo */}
        <div className="h-2 bg-blue-600 w-full" />

        <div className="p-8">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Recuperar Acesso</h2>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                  Introduza o seu <b>Número Mecanográfico</b>. Enviaremos as instruções para o seu e-mail profissional MobiFix.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1 ml-1">
                    Nº Mecanográfico
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Ex: 104004"
                    value={mecanografico}
                    onChange={(e) => setMecanografico(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                >
                  Enviar Instruções
                </button>
              </form>
            </>
          ) : (
            /* Estado de Sucesso */
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 text-green-600 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Pedido Enviado!</h2>
              <p className="text-slate-500 mt-3 text-sm">
                Se o número <b>{mecanografico}</b> estiver correto, receberá um link de recuperação em breve.
              </p>
              <button
                onClick={handleClose}
                className="mt-8 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
              >
                Voltar ao Login
              </button>
            </div>
          )}

          {/* Botão Cancelar (Apenas visível se não enviado) */}
          {!isSubmitted && (
            <div className="mt-6 text-center">
              <button
                onClick={handleClose}
                className="text-slate-400 text-sm hover:text-slate-600 transition-colors"
              >
                Cancelar e voltar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;