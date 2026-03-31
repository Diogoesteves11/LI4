USE fixnride_db;
GO

-- 1. Povoar Funcionários (Um de cada cargo para testar RBAC)
INSERT INTO Funcionarios (NumeroMecanografico, Nome, Email, Contacto, Cargo, PasswordHash, Especialidade)
VALUES 
('ADM001', 'Admin Principal', 'admin@fixnride.pt', '910000001', 'Administrador', '$2a$12$KZRN.cKaQnFeSk26/iGfcOh1UgXU1AEqduANBI6LqOPTdf9TbJSuu', NULL),
('OP001', 'João Operador', 'joao.op@fixnride.pt', '910000002', 'Operador', '$2a$12$KZRN.cKaQnFeSk26/iGfcOh1UgXU1AEqduANBI6LqOPTdf9TbJSuu', NULL),
('MEC001', 'Carlos Mecânico', 'carlos.mec@fixnride.pt', '910000003', 'Mecanico', '$2a$12$KZRN.cKaQnFeSk26/iGfcOh1UgXU1AEqduANBI6LqOPTdf9TbJSuu', 'Eletrónica e Baterias',NULL),
('MEC002', 'Sofia Técnica', 'sofia.tec@fixnride.pt', '910000004', 'Mecanico', '$2a$12$KZRN.cKaQnFeSk26/iGfcOh1UgXU1AEqduANBI6LqOPTdf9TbJSuu', 'Mecânica Estrutural',NULL);

-- 2. Povoar Clientes
INSERT INTO Clientes (Nome, Telefone, Morada, NIF, Email, PasswordHash)
VALUES 
('Diogo Cliente', '920000001', 'Rua da Universidade, Braga', '250123456', 'diogo.user@gmail.com', '$2a$12$KZRN.cKaQnFeSk26/iGfcOh1UgXU1AEqduANBI6LqOPTdf9TbJSuu'),
('Ana Silva', '920000002', 'Avenida Central, Guimarães', '260987654', 'ana.silva@outlook.com', '$2a$12$KZRN.cKaQnFeSk26/iGfcOh1UgXU1AEqduANBI6LqOPTdf9TbJSuu');

-- 3. Povoar Trotinetes (Ligadas aos clientes)
INSERT INTO Trotinetes (NumeroSerie, Marca, Modelo, ClienteID)
VALUES 
('SN-XIAOMI-001', 'Xiaomi', 'Mi Pro 2', 1),
('SN-NINEBOT-99', 'Segway-Ninebot', 'Max G30', 2),
('SN-XIAOMI-002', 'Xiaomi', 'Essential', 1);

-- 4. Povoar Catálogo de Peças
INSERT INTO Pecas (CodigoEAN, Nome, Descricao, CustoAquisicao, PVP, StockAtual, StockMinimo, Imagem)
VALUES 
('EAN001', 'Pneu 8.5 Polegadas', 'Pneu reforçado para Xiaomi', 12.50, 25.00, 20, 5, "pneu.jpg"),
('EAN002', 'Pastilhas de Travão', 'Compatível com vários modelos', 3.00, 8.50, 50, 10, "pastilha.jpg"),
('EAN003', 'Bateria 36V 12Ah', 'Bateria de substituição alta performance', 85.00, 150.00, 3, 2, "bateria.jpg");

-- 5. Catálogo de Intervenções (Mão de obra fixa)
INSERT INTO IntervencoesCatalogo (Descricao, PrecoFixoMaoDeObra, Especialidade)
VALUES 
('Substituição de Pneu', 15.00, 'Mecânica Estrutural'),
('Diagnóstico Elétrico', 20.00, 'Eletrónica e Baterias'),
('Revisão Geral', 30.00, 'Mecânica Estrutural');

-- 6. Criar um Serviço (Ordem de Serviço)
-- Serviço 1: Em execução para o Diogo
INSERT INTO Servicos (TrotineteID, Estado, DataAgendamento, DescricaoDiagnostico, Preco)
VALUES (1, 'Em Execução', GETDATE(), 'Furo no pneu traseiro e travão perro.', 0);

-- 7. Ligar Intervenção ao Serviço (Mecânico Carlos a trabalhar no Serviço 1)
INSERT INTO Servico_Intervencoes (ServicoID, IntervencaoID, MecanicoID, DataInicio)
VALUES (1, 1, 3, GETDATE());

-- 8. Adicionar Peças à Intervenção (Pneu gasto na troca)
INSERT INTO Intervencao_Pecas (ServicoID, IntervencaoID, PecaID, Quantidade)
VALUES (1, 1, 1, 1);

-- 9. Criar uma Venda Direta (Balcão)
INSERT INTO Vendas (OperadorID, DataVenda, Total)
VALUES (2, GETDATE(), 33.50); -- Ex: Venda de um pneu + pastilhas sem montagem

-- 10. Gerar uma Fatura para essa Venda
INSERT INTO Faturas (NumeroFatura, ClienteID, VendaID, ValorTotal, MetodoPagamento)
VALUES ('FAT-2024-001', 1, 1, 33.50, 'MBWay');

GO