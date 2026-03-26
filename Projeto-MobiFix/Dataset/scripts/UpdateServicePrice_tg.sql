CREATE TRIGGER TRG_UpdateServicePrice
ON Intervencao_Pecas
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    UPDATE s
    SET s.Preco = (
        -- Soma da mão de obra
        ISNULL((SELECT SUM(ic.PrecoFixoMaoDeObra) 
                FROM Servico_Intervencoes si 
                JOIN IntervencoesCatalogo ic ON si.IntervencaoID = ic.IntervencaoID 
                WHERE si.ServicoID = s.ServicoID), 0) +
        -- Soma das peças
        ISNULL((SELECT SUM(ip.Quantidade * p.PVP) 
                FROM Intervencao_Pecas ip 
                JOIN Pecas p ON ip.PecaID = p.PecaID 
                WHERE ip.ServicoID = s.ServicoID), 0)
    )
    FROM Servicos s
    WHERE s.ServicoID IN (SELECT ServicoID FROM inserted UNION SELECT ServicoID FROM deleted);
END;