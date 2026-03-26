CREATE TRIGGER TRG_CheckStock_And_Order
ON Pecas
AFTER UPDATE
AS
BEGIN
    -- Evitar que o trigger entre em loop infinito ou processe se o stock não mudou
    IF NOT UPDATE(StockAtual) RETURN;

    INSERT INTO EncomendasStock (PecaID, Quantidade, Estado, DataPedido)
    SELECT 
        i.PecaID, 
        i.PadraoReposicao, -- Usa a quantidade definida no catálogo
        'Pendente', 
        GETDATE()
    FROM inserted i
    INNER JOIN deleted d ON i.PecaID = d.PecaID
    WHERE i.StockAtual <= i.StockMinimo -- Se atingiu o mínimo
      AND d.StockAtual > i.StockMinimo  -- E antes estava acima (para não gerar 50 encomendas se o stock continuar baixo)
      AND NOT EXISTS (                  -- Verifica se já não existe uma encomenda pendente para esta peça
          SELECT 1 
          FROM EncomendasStock es 
          WHERE es.PecaID = i.PecaID 
            AND es.Estado IN ('Pendente', 'Em Trânsito')
      );
END;