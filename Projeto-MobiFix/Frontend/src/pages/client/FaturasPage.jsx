import  Header  from "../../components/Header";
import  BottomNav  from "../../components/BottomNav";
import { FileText, Download } from "lucide-react";

export default function Faturas() {
  const faturas = [
    {
      id: "1",
      number: "FT2025/001",
      date: "15 Mar 2025",
      description: "Reparação - Xiaomi Mi Pro Scooter Glasses",
      amount: 45.0,
      status: "Paga",
    },
    {
      id: "2",
      number: "FT2025/002",
      date: "10 Mar 2025",
      description: "Substituição Bateria",
      amount: 89.99,
      status: "Paga",
    },
    {
      id: "3",
      number: "FT2025/003",
      date: "05 Mar 2025",
      description: "Manutenção Preventiva",
      amount: 25.0,
      status: "Paga",
    },
    {
      id: "4",
      number: "FT2025/004",
      date: "28 Fev 2025",
      description: "Troca de Pneus",
      amount: 49.98,
      status: "Paga",
    },
  ];

  const totalPago = faturas.reduce((acc, fatura) => acc + fatura.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Minhas Faturas" />

      <div className="p-4">
        <div className="bg-blue-600 text-white rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-100 mb-1">Total Pago Este Ano</p>
          <p className="text-3xl font-bold">€{totalPago.toFixed(2)}</p>
        </div>

        <div className="space-y-3">
          {faturas.map((fatura) => (
            <div
              key={fatura.id}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-gray-900">
                      {fatura.number}
                    </h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {fatura.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {fatura.description}
                  </p>
                  <p className="text-xs text-gray-500">{fatura.date}</p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-lg font-bold text-blue-600">
                      €{fatura.amount.toFixed(2)}
                    </p>
                    <button
                    >
                      <Download className="w-4 h-4 mr-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
