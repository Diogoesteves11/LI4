import { jsPDF } from "jspdf";

export const gerarPDFFatura = (fatura) => {
  const doc = new jsPDF();

  // Cabeçalho
  doc.setFontSize(20);
  doc.text("MobiFix - Fatura", 10, 20);
  
  // Detalhes
  doc.setFontSize(12);
  doc.text(`Número: ${fatura.numeroFatura}`, 10, 40);
  doc.text(`Data: ${new Date(fatura.dataEmissao).toLocaleDateString('pt-PT')}`, 10, 50);
  doc.text(`Método: ${fatura.metodoPagamento}`, 10, 60);
  
  doc.line(10, 65, 200, 65); // Linha divisória

  doc.text(`Descrição: ${fatura.servicoID ? 'Serviço #' + fatura.servicoID : 'Venda #' + fatura.vendaID}`, 10, 75);
  
  doc.setFontSize(14);
  doc.text(`Total: ${fatura.valorTotal.toFixed(2)} EUR`, 10, 90);

  // Faz o download automático
  doc.save(`${fatura.numeroFatura}.pdf`);
};