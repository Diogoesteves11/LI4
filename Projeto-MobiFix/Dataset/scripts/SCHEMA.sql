-- 1. Criação do Banco de Dados
USE master;
GO

DROP DATABASE IF EXISTS fixnride_db;
CREATE DATABASE fixnride_db;
GO
USE fixnride_db;
GO

-- 2. Módulo de Utilizadores e Funcionários (Hierarquia com RBAC)
CREATE TABLE Funcionarios (
    FuncionarioID INT PRIMARY KEY IDENTITY(1,1),
    NumeroMecanografico NVARCHAR(50) UNIQUE NOT NULL, 
    Nome NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    Contacto NVARCHAR(20) NOT NULL,
    Cargo NVARCHAR(50) NOT NULL, 
    PasswordHash NVARCHAR(MAX) NOT NULL,
    Especialidade NVARCHAR(70) NULL, -- Apenas para Mecânicos
    Ativo BIT DEFAULT 1,
    -- Constraint para garantir cargos válidos
    CONSTRAINT CK_Funcionario_Cargo CHECK (Cargo IN ('Administrador', 'Operador', 'Mecanico'))
);

CREATE TABLE Clientes (
    ClienteID INT PRIMARY KEY IDENTITY(1,1),
    Nome NVARCHAR(255) NOT NULL,
    Telefone NVARCHAR(20) NOT NULL,
    Morada NVARCHAR(MAX) NULL, -- Opcional
    NIF NVARCHAR(20) UNIQUE NOT NULL,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL
);

-- 3. Módulo de Veículos e Catálogo
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
    Ativo BIT DEFAULT 1,
    -- Constraints de Integridade de Inventário 
    CONSTRAINT CK_Peca_Precos CHECK (PVP >= 0 AND CustoAquisicao >= 0),
    CONSTRAINT CK_Peca_Stock CHECK (StockAtual >= 0),
    CONSTRAINT CK_Peca_Minimo CHECK (StockMinimo >= 0)
);

-- 4. Módulo de Serviços e Intervenções (Núcleo da Oficina)
CREATE TABLE Servicos (
    ServicoID INT PRIMARY KEY IDENTITY(1,1),
    TrotineteID INT NOT NULL FOREIGN KEY REFERENCES Trotinetes(TrotineteID),
    Estado NVARCHAR(50) NOT NULL, 
    DataAgendamento DATETIME2 DEFAULT GETDATE(),
    DescricaoDiagnostico NVARCHAR(MAX) NULL, -- Preenchido pelo Mecânico [cite: 1298, 1299]
    FeedbackCliente NVARCHAR(MAX) NULL,
    DataConclusao DATETIME2 NULL,
    Preco DECIMAL(18,2) DEFAULT 0,
    -- Máquina de Estados do Serviço [cite: 1305, 1783]
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

-- Tabela de ligação: Histórico de quem fez o quê e quando [cite: 1305]
CREATE TABLE Servico_Intervencoes (
    ServicoID INT NOT NULL FOREIGN KEY REFERENCES Servicos(ServicoID),
    IntervencaoID INT NOT NULL FOREIGN KEY REFERENCES IntervencoesCatalogo(IntervencaoID),
    MecanicoID INT NOT NULL FOREIGN KEY REFERENCES Funcionarios(FuncionarioID),
    DataInicio DATETIME2 NULL,
    DataFim DATETIME2 NULL,
    TempoGastoMinutos AS (DATEDIFF(MINUTE, DataInicio, DataFim)) PERSISTED,
    PRIMARY KEY (ServicoID, IntervencaoID)
);

-- Rastreabilidade de Peças Específicas [cite: 1301, 1302]
CREATE TABLE Intervencao_Pecas (
    ServicoID INT NOT NULL,
    IntervencaoID INT NOT NULL,
    PecaID INT NOT NULL FOREIGN KEY REFERENCES Pecas(PecaID),
    Quantidade INT DEFAULT 1,
    FOREIGN KEY (ServicoID, IntervencaoID) REFERENCES Servico_Intervencoes(ServicoID, IntervencaoID),
    PRIMARY KEY (ServicoID, IntervencaoID, PecaID),
    CONSTRAINT CK_Intervencao_Qtd CHECK (Quantidade > 0)
);

-- 5. Módulo Comercial e Financeiro
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

-- 6. Módulo de Gestão Estratégica
CREATE TABLE Promocoes (
    PromocaoID INT PRIMARY KEY IDENTITY(1,1),
    Descricao NVARCHAR(255) NOT NULL,
    PercentagemDesconto DECIMAL(5,2) NOT NULL,
    DataInicio DATETIME2 NOT NULL,
    DataFim DATETIME2 NOT NULL,
    AdministradorID INT NOT NULL FOREIGN KEY REFERENCES Funcionarios(FuncionarioID),
    CONSTRAINT CK_Promocao_Desconto CHECK (PercentagemDesconto BETWEEN 0 AND 100),
    CONSTRAINT CK_Promocao_Datas CHECK (DataFim >= DataInicio) -- 
);

CREATE TABLE Promocao_Pecas (
    PromocaoID INT NOT NULL FOREIGN KEY REFERENCES Promocoes(PromocaoID),
    PecaID INT NOT NULL FOREIGN KEY REFERENCES Pecas(PecaID),
    PRIMARY KEY (PromocaoID, PecaID)
);

-- Módulo Click & Collect [cite: 1785]
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

-- Fluxo de Aprovisionamento [cite: 1158, 1784]
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
GO