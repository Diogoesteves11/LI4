-- Esperar que o SQL Server esteja pronto e criar a DB
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'fixnride_db')
BEGIN
    CREATE DATABASE fixnride_db;
END
GO

USE fixnride_db;
GO

-- CUIDADO: Isto apaga os dados das peças!
DROP TABLE IF EXISTS Intervencao_Pecas; -- Apagar primeiro as tabelas com FK
DROP TABLE IF EXISTS Pecas;

-- 2. Módulo de Utilizadores e Funcionários (Hierarquia com RBAC)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Funcionarios')
BEGIN
    CREATE TABLE Funcionarios (
        FuncionarioID INT PRIMARY KEY IDENTITY(1,1),
        NumeroMecanografico NVARCHAR(50) UNIQUE NOT NULL,
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
        ClienteID INT PRIMARY KEY IDENTITY(1,1),
        Nome NVARCHAR(255) NOT NULL,
        Telefone NVARCHAR(20) NOT NULL,
        Morada NVARCHAR(MAX) NULL,
        NIF NVARCHAR(20) UNIQUE NOT NULL,
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
        PecaID INT PRIMARY KEY IDENTITY(1,1),
        CodigoEAN NVARCHAR(50) UNIQUE NOT NULL,
        Nome NVARCHAR(255) NOT NULL,
        Descricao NVARCHAR(MAX) NULL,
        CustoAquisicao DECIMAL(18,2) NOT NULL,
        PVP DECIMAL(18,2) NOT NULL,
        StockAtual INT DEFAULT 0,
        StockMinimo INT DEFAULT 5,
        PadraoReposicao INT DEFAULT 5,
        Imagem NVARCHAR(MAX) NULL,
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
END
GO

-- Povoar dados de teste (só se tabelas estiverem vazias)
IF NOT EXISTS (SELECT 1 FROM Funcionarios)
BEGIN
    INSERT INTO Funcionarios (NumeroMecanografico, Nome, Email, Contacto, Cargo, PasswordHash, Especialidade)
    VALUES
    ('ADM001', 'Admin Principal', 'admin@fixnride.pt', '910000001', 'Administrador', '$2a$12$KZRN.cKaQnFeSk26/iGfcOh1UgXU1AEqduANBI6LqOPTdf9TbJSuu', NULL),
    ('OP001', 'João Operador', 'joao.op@fixnride.pt', '910000002', 'Operador', '$2a$12$KZRN.cKaQnFeSk26/iGfcOh1UgXU1AEqduANBI6LqOPTdf9TbJSuu', NULL),
    ('MEC001', 'Carlos Mecânico', 'carlos.mec@fixnride.pt', '910000003', 'Mecanico', '$2a$12$KZRN.cKaQnFeSk26/iGfcOh1UgXU1AEqduANBI6LqOPTdf9TbJSuu', 'ELETRICISTA'),
    ('MEC002', 'Sofia Técnica', 'sofia.tec@fixnride.pt', '910000004', 'Mecanico', '$2a$12$KZRN.cKaQnFeSk26/iGfcOh1UgXU1AEqduANBI6LqOPTdf9TbJSuu', 'MECANICA_GERAL');

    INSERT INTO Clientes (Nome, Telefone, Morada, NIF, Email, PasswordHash)
    VALUES
    ('Diogo Cliente', '920000001', 'Rua da Universidade, Braga', '250123456', 'diogo.user@gmail.com', '$2a$12$KZRN.cKaQnFeSk26/iGfcOh1UgXU1AEqduANBI6LqOPTdf9TbJSuu'),
    ('Ana Silva', '920000002', 'Avenida Central, Guimarães', '260987654', 'ana.silva@outlook.com', '$2a$12$KZRN.cKaQnFeSk26/iGfcOh1UgXU1AEqduANBI6LqOPTdf9TbJSuu');

    INSERT INTO Trotinetes (NumeroSerie, Marca, Modelo, ClienteID)
    VALUES
    ('SN-XIAOMI-001', 'Xiaomi', 'Mi Pro 2', 1),
    ('SN-NINEBOT-99', 'Segway-Ninebot', 'Max G30', 2),
    ('SN-XIAOMI-002', 'Xiaomi', 'Essential', 1);

    INSERT INTO Pecas (CodigoEAN, Nome, Descricao, CustoAquisicao, PVP, StockAtual, StockMinimo, Imagem)
    VALUES
    ('EAN001', 'Pneu 8.5 Polegadas', 'Pneu reforçado para Xiaomi', 12.50, 25.00, 20, 5, 'pneu.jpg'),
    ('EAN002', 'Pastilhas de Travão', 'Compatível com vários modelos', 3.00, 8.50, 50, 10, 'pastilha.jpg'),
    ('EAN003', 'Bateria 36V 12Ah', 'Bateria de substituição alta performance', 85.00, 150.00, 3, 2, 'bateria.jpg'),
    ('EAN004', 'Manete de Travão', 'Manete de travão com muita potência', 47.99, 97.33, 6, 2, 'travao.jpg');

    INSERT INTO IntervencoesCatalogo (Descricao, PrecoFixoMaoDeObra, Especialidade)
    VALUES
    ('Substituição de Pneu', 15.00, 'MECANICA_GERAL'),
    ('Diagnóstico Elétrico', 20.00, 'ELETRICISTA'),
    ('Revisão Geral', 30.00, 'MECANICA_GERAL');
END
GO
