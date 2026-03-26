CREATE TRIGGER TRG_UpdateStock_OnIntervencao
ON Intervencao_Pecas
AFTER INSERT
AS
BEGIN
    UPDATE Pecas
    SET StockAtual = StockAtual - i.Quantidade
    FROM Pecas
    INNER JOIN inserted i ON Pecas.PecaID = i.PecaID;
    
    -- Opcional: Impedir venda se não houver stock (Rollback)
    IF EXISTS (SELECT 1 FROM Pecas WHERE StockAtual < 0)
    BEGIN
        RAISERROR ('Stock insuficiente para esta peça.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;