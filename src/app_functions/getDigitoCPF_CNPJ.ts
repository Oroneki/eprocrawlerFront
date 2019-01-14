export const getDigito = (CPF_OU_CNPJ: string) => {
    // return CPF_OU_CNPJ;
    const semNada = CPF_OU_CNPJ.replace(/\D/g, '');
    switch (semNada.length) {
        case 11: // cpf
            return semNada.substr(6, 2);
        case 14: // cnpj
            return semNada.substr(6, 2);
        default:
            return '??';
    }
};