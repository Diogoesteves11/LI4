# --- Configuração para Cmd + S (VS Code) ---

# 1. Forçar uso de pdflatex (já que mudaste as fontes para helvet)
$pdf_mode = 1;
$pdflatex = 'pdflatex -synctex=1 -interaction=nonstopmode -file-line-error %O %S';

# 2. Ensinar o latexmk a gerar as Siglas (Nomenclature)
# Isto faz com que o VS Code saiba correr o makeindex sozinho
add_cus_dep('nlo', 'nls', 0, 'nlo2nls');
sub nlo2nls {
    system("makeindex -s nomencl.ist -o \"$_[0].nls\" \"$_[0].nlo\"");
}

# 3. Extensões limpas automaticamente
$clean_ext = "nlo nls";