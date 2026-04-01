-- Esperar que o SQL Server esteja pronto e criar a DB
-- 1. SETUP INICIAL
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'fixnride_db')
    CREATE DATABASE fixnride_db;
GO

USE fixnride_db;
GO

-- Limpeza de tabelas para re-execução (Ordem correta devido às FKs)
DROP TABLE IF EXISTS AgendaMecanicos;
DROP TABLE IF EXISTS EncomendaCliente_Itens;
DROP TABLE IF EXISTS EncomendasCliente;
DROP TABLE IF EXISTS Promocao_Pecas;
DROP TABLE IF EXISTS Promocoes;
DROP TABLE IF EXISTS NotasCredito;
DROP TABLE IF EXISTS Devolucoes;
DROP TABLE IF EXISTS Faturas;
DROP TABLE IF EXISTS Venda_Pecas;
DROP TABLE IF EXISTS Vendas;
DROP TABLE IF EXISTS Intervencao_Pecas;
DROP TABLE IF EXISTS Servico_Intervencoes;
DROP TABLE IF EXISTS IntervencoesCatalogo;
DROP TABLE IF EXISTS Servicos;
DROP TABLE IF EXISTS EncomendasStock;
DROP TABLE IF EXISTS Pecas;
DROP TABLE IF EXISTS Trotinetes;
DROP TABLE IF EXISTS Clientes;
DROP TABLE IF EXISTS Funcionarios;
GO

    CREATE TABLE Funcionarios (
        NumeroMecanografico PRIMARY KEY NVARCHAR(50) UNIQUE NOT NULL,
        Nome NVARCHAR(255) NOT NULL,
        Email NVARCHAR(255) UNIQUE NOT NULL,
        Contacto NVARCHAR(20) NOT NULL,
        Cargo NVARCHAR(50) NOT NULL,
        PasswordHash NVARCHAR(MAX) NOT NULL,
        Especialidade NVARCHAR(70) NULL,
        Ativo BIT DEFAULT 1,
        CONSTRAINT CK_Funcionario_Cargo CHECK (Cargo IN ('Administrador', 'Operador', 'Mecanico'))
    );

    CREATE TABLE Clientes (
        Nome NVARCHAR(255) NOT NULL,
        Telefone NVARCHAR(20) NOT NULL,
        Morada NVARCHAR(MAX) NULL,
        NIF PRIMARY KEY NVARCHAR(20) UNIQUE NOT NULL,
        Email NVARCHAR(255) UNIQUE NOT NULL,
        PasswordHash NVARCHAR(MAX) NOT NULL
    );

    CREATE TABLE Trotinetes (
        TrotineteID INT PRIMARY KEY IDENTITY(1,1),
        NumeroSerie NVARCHAR(100) UNIQUE NOT NULL,
        Marca NVARCHAR(100) NOT NULL,
        Modelo NVARCHAR(100) NOT NULL,
        EmServico BIT DEFAULT 0,
        ClienteID INT NOT NULL FOREIGN KEY REFERENCES Clientes(ClienteID)
    );

    CREATE TABLE Pecas (
        CodigoEAN PRIMARY KEY NVARCHAR(50) UNIQUE NOT NULL,
        Nome NVARCHAR(255) NOT NULL,
        Descricao NVARCHAR(MAX) NULL,
        CustoAquisicao DECIMAL(18,2) NOT NULL,
        PVP DECIMAL(18,2) NOT NULL,
        StockAtual INT DEFAULT 0,
        StockMinimo INT DEFAULT 5,
        PadraoReposicao INT DEFAULT 5,
        Imagem NVARCHAR(MAX) NULL,
        Categoria NVARCHAR(MAX) NOT NULL,
        Ativo BIT DEFAULT 1,
        CONSTRAINT CK_Peca_Precos CHECK (PVP >= 0 AND CustoAquisicao >= 0),
        CONSTRAINT CK_Peca_Stock CHECK (StockAtual >= 0),
        CONSTRAINT CK_Peca_Minimo CHECK (StockMinimo >= 0)
    );

    CREATE TABLE Servicos (
        ServicoID INT PRIMARY KEY IDENTITY(1,1),
        TrotineteID INT NOT NULL FOREIGN KEY REFERENCES Trotinetes(TrotineteID),
        Estado NVARCHAR(50) NOT NULL,
        DataAgendamento DATETIME2 DEFAULT GETDATE(),
        DescricaoDiagnostico NVARCHAR(MAX) NULL,
        FeedbackCliente NVARCHAR(MAX) NULL,
        DataConclusao DATETIME2 NULL,
        Preco DECIMAL(18,2) DEFAULT 0,
        CONSTRAINT CK_Servico_Estado CHECK (Estado IN ('Agendado', 'Em Execução', 'Concluido', 'Fechado')),
        CONSTRAINT CK_Servico_Preco CHECK (Preco >= 0)
    );

    CREATE TABLE IntervencoesCatalogo (
        IntervencaoID INT PRIMARY KEY IDENTITY(1,1),
        Descricao NVARCHAR(255) NOT NULL,
        PrecoFixoMaoDeObra DECIMAL(18,2) NOT NULL,
        Especialidade VARCHAR(70) NOT NULL,
        CONSTRAINT CK_Intervencao_MaoObra CHECK (PrecoFixoMaoDeObra >= 0)
    );

    CREATE TABLE Servico_Intervencoes (
        ServicoID INT NOT NULL FOREIGN KEY REFERENCES Servicos(ServicoID),
        IntervencaoID INT NOT NULL FOREIGN KEY REFERENCES IntervencoesCatalogo(IntervencaoID),
        MecanicoID INT NOT NULL FOREIGN KEY REFERENCES Funcionarios(FuncionarioID),
        DataInicio DATETIME2 NULL,
        DataFim DATETIME2 NULL,
        TempoGastoMinutos AS (DATEDIFF(MINUTE, DataInicio, DataFim)) PERSISTED,
        PRIMARY KEY (ServicoID, IntervencaoID)
    );

    CREATE TABLE Intervencao_Pecas (
        ServicoID INT NOT NULL,
        IntervencaoID INT NOT NULL,
        PecaID INT NOT NULL FOREIGN KEY REFERENCES Pecas(PecaID),
        Quantidade INT DEFAULT 1,
        FOREIGN KEY (ServicoID, IntervencaoID) REFERENCES Servico_Intervencoes(ServicoID, IntervencaoID),
        PRIMARY KEY (ServicoID, IntervencaoID, PecaID),
        CONSTRAINT CK_Intervencao_Qtd CHECK (Quantidade > 0)
    );

    CREATE TABLE Vendas (
        VendaID INT PRIMARY KEY IDENTITY(1,1),
        OperadorID INT NOT NULL FOREIGN KEY REFERENCES Funcionarios(FuncionarioID),
        DataVenda DATETIME2 DEFAULT GETDATE(),
        Total DECIMAL(18,2) NOT NULL DEFAULT 0,
        CONSTRAINT CK_Venda_Total CHECK (Total >= 0)
    );

    CREATE TABLE Faturas (
        FaturaID INT PRIMARY KEY IDENTITY(1,1),
        NumeroFatura NVARCHAR(50) UNIQUE NOT NULL,
        DataEmissao DATETIME2 DEFAULT GETDATE(),
        ClienteID INT NOT NULL FOREIGN KEY REFERENCES Clientes(ClienteID),
        ServicoID INT NULL FOREIGN KEY REFERENCES Servicos(ServicoID),
        VendaID INT NULL FOREIGN KEY REFERENCES Vendas(VendaID),
        ValorTotal DECIMAL(18,2) NOT NULL,
        MetodoPagamento NVARCHAR(50) NOT NULL,
        CONSTRAINT CK_Fatura_Total CHECK (ValorTotal >= 0),
        CONSTRAINT CK_Fatura_Metodo CHECK (MetodoPagamento IN ('MBWay', 'Multibanco', 'Numerário'))
    );

    CREATE TABLE Devolucoes (
        DevolucaoID INT PRIMARY KEY IDENTITY(1,1),
        FaturaID INT NOT NULL FOREIGN KEY REFERENCES Faturas(FaturaID),
        DataDevolucao DATETIME2 DEFAULT GETDATE(),
        Motivo NVARCHAR(MAX) NOT NULL
    );

    CREATE TABLE NotasCredito (
        NotaCreditoID INT PRIMARY KEY IDENTITY(1,1),
        DevolucaoID INT UNIQUE NOT NULL FOREIGN KEY REFERENCES Devolucoes(DevolucaoID),
        ValorCreditado DECIMAL(18,2) NOT NULL,
        CONSTRAINT CK_Nota_Credito CHECK (ValorCreditado >= 0)
    );

    CREATE TABLE Promocoes (
        PromocaoID INT PRIMARY KEY IDENTITY(1,1),
        Descricao NVARCHAR(255) NOT NULL,
        PercentagemDesconto DECIMAL(5,2) NOT NULL,
        DataInicio DATETIME2 NOT NULL,
        DataFim DATETIME2 NOT NULL,
        AdministradorID INT NOT NULL FOREIGN KEY REFERENCES Funcionarios(FuncionarioID),
        CONSTRAINT CK_Promocao_Desconto CHECK (PercentagemDesconto BETWEEN 0 AND 100),
        CONSTRAINT CK_Promocao_Datas CHECK (DataFim >= DataInicio)
    );

    CREATE TABLE Venda_Pecas (
        VendaID INT NOT NULL FOREIGN KEY REFERENCES Vendas(VendaID),
        PecaID INT NOT NULL FOREIGN KEY REFERENCES Pecas(PecaID),
        Quantidade INT NOT NULL,
        PrecoUnitario DECIMAL(18,2) NOT NULL, -- Guardamos o preço no momento da venda
        Subtotal AS (Quantidade * PrecoUnitario) PERSISTED,
        PRIMARY KEY (VendaID, PecaID),
        CONSTRAINT CK_VendaItem_Qtd CHECK (Quantidade > 0),
        CONSTRAINT CK_VendaItem_Preco CHECK (PrecoUnitario >= 0)
    );

    CREATE TABLE Promocao_Pecas (
        PromocaoID INT NOT NULL FOREIGN KEY REFERENCES Promocoes(PromocaoID),
        PecaID INT NOT NULL FOREIGN KEY REFERENCES Pecas(PecaID),
        PRIMARY KEY (PromocaoID, PecaID)
    );

    CREATE TABLE EncomendasCliente (
        EncomendaClienteID INT PRIMARY KEY IDENTITY(1,1),
        ClienteID INT NOT NULL FOREIGN KEY REFERENCES Clientes(ClienteID),
        DataEncomenda DATETIME2 DEFAULT GETDATE(),
        Estado NVARCHAR(50) DEFAULT 'Pronto para Levantamento',
        Total DECIMAL(18,2) NOT NULL DEFAULT 0,
        FaturaID INT NULL FOREIGN KEY REFERENCES Faturas(FaturaID),
        CONSTRAINT CK_EncCliente_Total CHECK (Total >= 0)
    );

    CREATE TABLE EncomendaCliente_Itens (
        EncomendaClienteID INT NOT NULL FOREIGN KEY REFERENCES EncomendasCliente(EncomendaClienteID),
        PecaID INT NOT NULL FOREIGN KEY REFERENCES Pecas(PecaID),
        Quantidade INT NOT NULL,
        PRIMARY KEY (EncomendaClienteID, PecaID),
        CONSTRAINT CK_EncItem_Qtd CHECK (Quantidade > 0)
    );

    CREATE TABLE EncomendasStock (
        EncomendaID INT PRIMARY KEY IDENTITY(1,1),
        PecaID INT NOT NULL FOREIGN KEY REFERENCES Pecas(PecaID),
        Quantidade INT NOT NULL,
        Estado NVARCHAR(50) NOT NULL,
        DataPedido DATETIME2 DEFAULT GETDATE(),
        OperadorRececaoID INT NULL FOREIGN KEY REFERENCES Funcionarios(FuncionarioID),
        AdminValidadorID INT NULL FOREIGN KEY REFERENCES Funcionarios(FuncionarioID),
        CONSTRAINT CK_StockEnc_Qtd CHECK (Quantidade > 0),
        CONSTRAINT CK_StockEnc_Estado CHECK (Estado IN ('Pendente', 'Em Trânsito', 'Rececionada'))
    );

    CREATE TABLE AgendaMecanicos (
        AgendaID INT PRIMARY KEY IDENTITY(1,1),
        MecanicoID INT NOT NULL FOREIGN KEY REFERENCES Funcionarios(FuncionarioID),
        ServicoID INT NOT NULL FOREIGN KEY REFERENCES Servicos(ServicoID),
        TipoSlot NVARCHAR(20) NOT NULL,
        IntervencaoID INT NULL FOREIGN KEY REFERENCES IntervencoesCatalogo(IntervencaoID),
        DataHoraInicio DATETIME2 NOT NULL,
        Estado NVARCHAR(20) DEFAULT 'Reservado',
        CONSTRAINT CK_TipoSlot CHECK (TipoSlot IN ('Diagnostico', 'Reparacao'))
    );
GO

--VIEWS
CREATE OR ALTER VIEW vw_Dashboard_OrigemReceita AS
SELECT 
    'Mão-de-Obra' AS Categoria,
    SUM(ic.PrecoFixoMaoDeObra) AS ValorTotal
FROM Servico_Intervencoes si
JOIN IntervencoesCatalogo ic ON si.IntervencaoID = ic.IntervencaoID
JOIN Servicos s ON si.ServicoID = s.ServicoID
WHERE s.Estado IN ('Concluido', 'Fechado')

UNION ALL

SELECT 
    'Peças' AS Categoria,
    SUM(Subtotal) AS ValorTotal
FROM (
    -- Peças de Intervenções
    SELECT ip.Quantidade * p.PVP AS Subtotal
    FROM Intervencao_Pecas ip
    JOIN Pecas p ON ip.PecaID = p.PecaID
    
    UNION ALL
    
    -- Peças de Vendas Diretas
    SELECT vi.Quantidade * vi.PrecoUnitario AS Subtotal
    FROM Venda_Pecas vi
) AS TodasPecas;
GO

CREATE OR ALTER VIEW vw_Dashboard_EficienciaMensal AS
SELECT 
    FORMAT(DataFim, 'MMM', 'pt-PT') AS Mes,
    MONTH(DataFim) AS MesNum,
    YEAR(DataFim) AS Ano,
    CAST(AVG(CAST(TempoGastoMinutos AS DECIMAL(18,2)) / 60) AS DECIMAL(18,2)) AS TempoMedioHoras
FROM Servico_Intervencoes
WHERE DataFim IS NOT NULL
GROUP BY FORMAT(DataFim, 'MMM', 'pt-PT'), MONTH(DataFim), YEAR(DataFim);
GO

CREATE OR ALTER VIEW vw_Dashboard_StatsGlobais AS
SELECT 
    (SELECT SUM(ValorTotal) FROM Faturas) AS FaturacaoTotal,
    (SELECT COUNT(*) FROM Servicos WHERE Estado = 'Concluido') AS ServicosConcluidos,
    (SELECT CAST(AVG(CAST(TempoGastoMinutos AS DECIMAL(18,2)) / 60) AS DECIMAL(18,2)) 
     FROM Servico_Intervencoes WHERE DataFim IS NOT NULL) AS TempoMedioGeral,
    (SELECT COUNT(*) FROM Pecas WHERE StockAtual <= StockMinimo) AS AlertasStock
GO

CREATE OR ALTER TRIGGER trg_UpdateServicoPreco_Pecas
ON Intervencao_Pecas
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE s
    SET s.Preco = (
        -- Soma da Mão de Obra
        ISNULL((SELECT SUM(ic.PrecoFixoMaoDeObra) 
                FROM Servico_Intervencoes si 
                JOIN IntervencoesCatalogo ic ON si.IntervencaoID = ic.IntervencaoID 
                WHERE si.ServicoID = s.ServicoID), 0) +
        -- Soma das Peças
        ISNULL((SELECT SUM(ip.Quantidade * p.PVP) 
                FROM Intervencao_Pecas ip 
                JOIN Pecas p ON ip.PecaID = p.PecaID 
                WHERE ip.ServicoID = s.ServicoID), 0)
    )
    FROM Servicos s
    WHERE s.ServicoID IN (SELECT ServicoID FROM inserted UNION SELECT ServicoID FROM deleted);
END;
GO

--TRIGGERS
CREATE OR ALTER TRIGGER trg_GestaoStock_Oficina
ON Intervencao_Pecas
AFTER INSERT, UPDATE, DELETE AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM deleted) UPDATE P SET P.StockAtual = P.StockAtual + d.Quantidade FROM Pecas P JOIN deleted d ON P.PecaID = d.PecaID;
    IF EXISTS (SELECT 1 FROM inserted) UPDATE P SET P.StockAtual = P.StockAtual - i.Quantidade FROM Pecas P JOIN inserted i ON P.PecaID = i.PecaID;
    IF EXISTS (SELECT 1 FROM Pecas WHERE StockAtual < 0) BEGIN
        RAISERROR ('Stock insuficiente para peças de oficina.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

-- B) Gestão de Stock e Atualização de Total (Venda Direta)
CREATE OR ALTER TRIGGER trg_GestaoStock_VendaDireta
ON Venda_Pecas
AFTER INSERT, UPDATE, DELETE AS
BEGIN
    SET NOCOUNT ON;
    -- Atualiza Stock
    IF EXISTS (SELECT 1 FROM deleted) UPDATE P SET P.StockAtual = P.StockAtual + d.Quantidade FROM Pecas P JOIN deleted d ON P.PecaID = d.PecaID;
    IF EXISTS (SELECT 1 FROM inserted) UPDATE P SET P.StockAtual = P.StockAtual - i.Quantidade FROM Pecas P JOIN inserted i ON P.PecaID = i.PecaID;
    
    -- Atualiza o Total da Venda automaticamente
    UPDATE V SET V.Total = ISNULL((SELECT SUM(Subtotal) FROM Venda_Pecas WHERE VendaID = V.VendaID), 0)
    FROM Vendas V WHERE V.VendaID IN (SELECT VendaID FROM inserted UNION SELECT VendaID FROM deleted);

    IF EXISTS (SELECT 1 FROM Pecas WHERE StockAtual < 0) BEGIN
        RAISERROR ('Stock insuficiente para venda de balcão.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO

-- C) Auto-Encomenda quando stock atinge mínimo
CREATE OR ALTER TRIGGER trg_CheckStock_And_Order
ON Pecas
AFTER UPDATE AS
BEGIN
    IF NOT UPDATE(StockAtual) RETURN;
    INSERT INTO EncomendasStock (PecaID, Quantidade, Estado, DataPedido)
    SELECT i.PecaID, i.PadraoReposicao, 'Pendente', GETDATE()
    FROM inserted i JOIN deleted d ON i.PecaID = d.PecaID
    WHERE i.StockAtual <= i.StockMinimo AND d.StockAtual > i.StockMinimo
      AND NOT EXISTS (SELECT 1 FROM EncomendasStock es WHERE es.PecaID = i.PecaID AND es.Estado IN ('Pendente', 'Em Trânsito'));
END;
GO