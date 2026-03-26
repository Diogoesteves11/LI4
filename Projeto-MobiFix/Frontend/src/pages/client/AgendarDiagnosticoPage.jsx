import { Calendar, Clock, AlertCircle, Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";

export default function AgendarDiagnostico(){
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedScooter, setSelectedScooter] = useState("");
  const [problem, setProblem] = useState("");

  const availableTimes = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00",
  ];

  const scooters = [
    { id: "3", name: "Xiaomi Essential - XM2022-1234" },
    { id: "1", name: "Xiaomi Mi Pro 2 - XM2023-4567" },
    { id: "2", name: "Segway Ninebot Max - SG2023-8901" },
    { id: "4", name: "Ninebot KickScooter E45 - NB2023-5678" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    alert("Diagnóstico agendado com sucesso!");
    navigate("/cliente");
  }

  const isFormValid = selectedDate && selectedTime && selectedScooter && problem;

  return (
  <main className="min-h-screen bg-slate-50 pb-28">
  <Header title="Agendar Diagnóstico" showBack />
  <div className="px-5 py-6">
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 flex gap-3 shadow-sm">
          <AlertCircle className="text-blue-600 shrink-0" size={20} />
          <p className="text-xs text-blue-800 leading-relaxed">
            Agende um diagnóstico gratuito. Os nossos técnicos irão avaliar o seu
            veículo e fornecer um orçamento detalhado em 24h.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">
              Selecione a Trotinete
            </label>
            <select
              value={selectedScooter}
              onChange={(e) => setSelectedScooter(e.target.value)}
              required
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none shadow-sm"
            >
              <option value="">Escolha um veículo...</option>
              {scooters.map((scooter) => (
                <option key={scooter.id} value={scooter.id}>
                  {scooter.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">
              <Calendar className="inline mr-1.5" size={14} />
              Data do Diagnóstico
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider ml-1">
              <Clock className="inline mr-1.5" size={14} />
              Horário Disponível
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                    selectedTime === time
                      ? "bg-blue-600 text-white border-blue-600 shadow-md scale-[1.02]"
                      : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 active:bg-slate-50"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider ml-1">
              Descrição do Problema
            </label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={4}
              placeholder="Ex: O travão de trás faz barulho e a luz não acende..."
              required
              className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-blue-600 text-white rounded-2xl p-5 font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:pointer-events-none mt-4"
          >
            Confirmar Agendamento
          </button>
        </form>

        <section className="mt-10 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-widest">
            Apoio ao Cliente
          </h3>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                <Phone size={14} className="text-blue-600" />
              </div>
              +351 912 345 678
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                <Mail size={14} className="text-blue-600" />
              </div>
              contacto@fixnride.pt
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                <MapPin size={14} className="text-blue-600" />
              </div>
              Rua das Trotinetes, 123, Lisboa
            </li>
          </ul>
        </section>
      </div>

      <BottomNav />

  </main>
  )
}