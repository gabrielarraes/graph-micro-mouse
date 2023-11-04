import express from 'express';
import * as dfs from './public/dfs.js';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const app = express();
const port = 5000;

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.listen(port, () => {
    console.log(`Now listening on port ${ port }`);
});

const graph = {
    A: {
        visited: false,
        value: 'A',
        list: ['B', 'C']
    },
    B: {
        visited: false,
        value: 'B',
        list: ['A']
    },
    C: {
        visited: false,
        value: 'C',
        list: ['A']
    }
}

dfs.run();
