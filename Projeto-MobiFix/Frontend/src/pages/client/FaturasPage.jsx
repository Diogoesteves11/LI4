import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";
import { FileText, Download, Loader2 } from "lucide-react";
import { useFaturas } from "../../hooks/useFaturas"
import { gerarPDFFatura } from "../../utils/PDFFatura";

export default function Faturas() {
  // 1. Obtemos o ID (Idealmente viria de um AuthContext, mas aqui usamos localStorage como planeado)
  const clienteId = localStorage.getItem('id');
  
  // 2. Usamos o hook
  const { data: faturas, isLoading, isError } = useFaturas(clienteId);

  // 3. Função para lidar com o download
  const handleDownload = async (id) => {
    try {
      await faturaService.downloadPDF(id);
    } catch (err) {
      alert("Erro ao descarregar o PDF. Verifica se o ficheiro existe no servidor.");
    }
  };

  // Cálculo do total baseado nos dados reais da API
  const totalPago = faturas?.reduce((acc, f) => acc + f.valorTotal, 0) || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 text-red-500">Erro ao carregar faturas. Tenta novamente.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="Minhas Faturas" />

      <div className="p-4">
        <div className="bg-blue-600 text-white rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-100 mb-1">Total Pago Acumulado</p>
          <p className="text-3xl font-bold">€{totalPago.toFixed(2)}</p>
        </div>

        <div className="space-y-3">
          {faturas?.length === 0 && (
            <p className="text-center text-gray-500 mt-10">Não foram encontradas faturas.</p>
          )}

          {faturas?.map((fatura) => (
            <div
              key={fatura.faturaID}
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-gray-900">
                      {fatura.numeroFatura}
                    </h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Paga ({fatura.metodoPagamento})
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {/* Como o DTO não tem descrição, usamos IDs ou info genérica */}
                    {fatura.servicoID ? `Serviço de Manutenção #${fatura.servicoID}` : `Venda #${fatura.vendaID}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(fatura.dataEmissao).toLocaleDateString('pt-PT')}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-lg font-bold text-blue-600">
                      €{fatura.valorTotal.toFixed(2)}
                    </p>
                    <button
                      onClick={() => gerarPDFFatura(fatura)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-5 h-5" />
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