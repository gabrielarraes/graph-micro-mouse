import express from 'express';
import * as dfs from './public/algorithms/dfs.js';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const app = express();
const port = 5000;

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.listen(port, () => {
    console.log(`Now listening on port ${ port }`);
});

dfs.run().then(dfsRunResponse => {
    console.log('caminho válido: ', dfsRunResponse.caminho_valido)
    console.log('quantidade de movimentos: ', dfsRunResponse.quantidade_movimentos)
});
