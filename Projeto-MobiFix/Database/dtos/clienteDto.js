const paraClienteDto = (c) => {
    if (!c) return null;
    return {
        NIF: c._id.toString(),
        Nome: c.nome,
        Telefone: c.telefone,
        Morada: c.morada || null,
        Email: c.email,
        PasswordHash: c.passwordHash
    };
};

module.exports = { paraClienteDto };
