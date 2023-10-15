const express = require('express');
const {
    buscarHistorico,
    buscarHistoricoPorId,
    buscarHistoricoPorAno,
    calcularReajuste,
    validacaoErro
} = require('./servicos/servico');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

app.use(bodyParser.json());

app.get('/historicoIPCA/calculo', (req, res) => {
    const valor = parseFloat(req.query.valor);
    const dataInicialMes = parseInt(req.query.mesInicial);
    const dataInicialAno = parseInt(req.query.anoInicial);
    const dataFinalMes = parseInt(req.query.mesFinal);
    const dataFinalAno = parseInt(req.query.anoFinal);

    if (validacaoErro(valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno)) {
        res.status(400).json({
            erro: 'Erro de validação'
        });
    }

    const resultado = calcularReajuste(valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno);
    res.json({
        resultado: resultado
    });
});

app.get('/historicoIPCA/:id', (req, res) => {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
        res.status(400).json({
            erro: 'Id inválido'
        });
    }

    const resultado = buscarHistoricoPorId(id);

    if (resultado) {
        res.json(resultado);
    } else {
        res.status(404).json({
            erro: 'Id não encontrado'
        });
    }
});

app.get('/historicoIPCA', (req, res) => {
    const ano = parseInt(req.query.ano);

    if (isNaN(ano)) {
        res.json(buscarHistorico());
    } else {
        const resultado = buscarHistoricoPorAno(ano);
        if (resultado.length > 0) {
            res.json(resultado);
        } else {
            res.status(404).json({
                erro: 'Nenhum histórico encontrado para o ano informado'
            });
        }
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta: ${process.env.PORT}`);
});