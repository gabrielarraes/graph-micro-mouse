import * as api from "../fetch/fetch-maze-api.js";
import { parentPort } from 'worker_threads'

let visited = new Set();
let moviments = [];

parentPort.on('message', async (data) => {
    let initialPosition = {
        pos_atual: 0,
        inicio: false,
        final: false,
        movimentos: []
    };

    await api.initializeMaze(data.userId, data.maze).then(start => {
        initialPosition = start
        moviments.push(start.pos_atual);
    });

    await dfs(initialPosition, data.userId, data.maze);

    await api.validatePath(data.userId, data.maze, moviments).then(dfsRunResponse => {
        console.log('caminho válido: ', dfsRunResponse.caminho_valido)
        console.log('quantidade de movimentos: ', dfsRunResponse.quantidade_movimentos)
    });
})

export async function dfs(position, user, maze, parent) {
    if(!visited.has(position.pos_atual)) {
        visited.add(position.pos_atual);
    }

    if(position.final) {
        return position
    }

    for(const child of position.movimentos) {
        if(!visited.has(child)) {
            const childPosition = await move(user, maze, child);
            const dfsReturn = await dfs(childPosition, user, maze, position.pos_atual);

            if(dfsReturn) {
                return dfsReturn;
            }

            if(!dfsReturn && child === position.movimentos[position.movimentos.length - 1] && parent !== undefined) {
                await move(user, maze, parent);
                return null;
            }
        } else if(child === position.movimentos[position.movimentos.length - 1]) {
            if(parent) {
                await move(user, maze, parent);
                return null;
            }
        }
    }
}

async function move(id, maze, newPosition) {
    let result = {}

    await api.move(id, maze, newPosition).then(res => {
        if(res.pos_atual) {
            moviments.push(res.pos_atual);
            result = res;
        } else {
            console.error('Error on response');
        }
    });

    return result;
}
