const {
    historicoInflacao
} = require('../dados/dados');

const buscarHistorico = () => {
    return historicoInflacao;
}

const buscarHistoricoPorId = (id) => {
    const idHistorico = parseInt(id);
    const historico = historicoInflacao.find(historico => historico.id === idHistorico);
    return historico;
}

const buscarHistoricoPorAno = (ano) => {
    const anoHistorico = parseInt(ano);
    const historico = historicoInflacao.filter(historico => historico.ano === anoHistorico);
    return historico;
}


const calcularReajuste = (valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno) => {
    const historicoFiltrado = historicoInflacao.filter(
        historico => {
            if (dataInicialAno === dataFinalAno) {
                return historico.ano === dataInicialAno && historico.mes >= dataInicialMes && historico.mes <= dataFinalMes
            } else {
                return (
                    historico.ano === dataInicialAno && historico.mes >= dataInicialMes ||
                    historico.ano > dataInicialAno && historico.ano < dataFinalAno ||
                    historico.ano === dataFinalAno && historico.mes <= dataFinalMes
                );
            }
        }
    );

    let taxasMensais = 1;
    for (const historico of historicoFiltrado) {
        taxasMensais *= (historico.ipca / 100) + 1;
    }

    const valorReajustado = valor * taxasMensais;

    return parseFloat(valorReajustado.toFixed(2));
}

const validacaoErro = (valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno) => {
    const anoLimiteFinal = historicoInflacao[historicoInflacao.length - 1].ano;
    const anoLimiteInicial = historicoInflacao[0].ano;
    const mesLimiteFinal = historicoInflacao[historicoInflacao.length - 1].mes;

    if (
        isNaN(valor) ||
        isNaN(dataInicialMes) ||
        isNaN(dataInicialAno) ||
        isNaN(dataFinalMes) ||
        isNaN(dataFinalAno) ||
        dataInicialMes < 1 || dataInicialMes > 12 ||
        dataInicialAno < anoLimiteInicial || dataInicialAno > anoLimiteFinal ||
        dataFinalMes < 1 || dataFinalMes > 12 ||
        dataFinalAno < anoLimiteInicial || dataFinalAno > anoLimiteFinal ||
        (dataFinalAno === anoLimiteFinal && dataFinalMes > mesLimiteFinal) ||
        dataFinalAno < dataInicialAno ||
        (dataFinalAno === dataInicialAno && dataFinalMes < dataInicialMes)
    ) {
        return true;
    } else {
        return false;
    }
};

module.exports = {
    buscarHistorico,
    buscarHistoricoPorId,
    buscarHistoricoPorAno,
    calcularReajuste,
    validacaoErro
};