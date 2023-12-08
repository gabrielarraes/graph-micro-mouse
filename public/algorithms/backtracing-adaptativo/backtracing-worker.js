import * as api from "../../consumer/maze-api-consumer.js";
import { parentPort } from 'worker_threads';
import { performance } from 'perf_hooks';

let visited = new Set();
let movements = [];

parentPort.on('message', async (data) => {
    const startTime = performance.now(); // Inicia o cronômetro

    let initialPosition = await api.initializeMaze(data.userId, data.maze);

    const pathFound = await dfs(initialPosition, data.userId, data.maze);
    
    const endTime = performance.now(); // Para o cronômetro
    const timeTaken = endTime - startTime; // Calcula o tempo gasto

    if (pathFound) {
        await api.validatePath(data.userId, data.maze, pathFound).then(dfsRunResponse => {
            console.log(
                'Labirinto:', data.maze,
                '| Solução é válida:', dfsRunResponse.caminho_valido,
                '| Tempo gasto (ms):', timeTaken.toFixed(2),
                '| Caminho:', pathFound
            );
        });
    } else {
        console.log('Nenhum caminho encontrado para o labirinto:', data.maze, '| Tempo gasto (ms):', timeTaken.toFixed(2));
    }
});

async function dfs(position, user, maze, path = []) {
    if (position.final) {
        return path.concat(position.pos_atual);
    }

    visited.add(position.pos_atual);
    path.push(position.pos_atual);

    for (const nextMove of position.movimentos) {
        if (!visited.has(nextMove)) {
            const nextPosition = await move(user, maze, nextMove);
            if (nextPosition) {
                const result = await dfs(nextPosition, user, maze, path);
                if (result) return result; // Caminho encontrado
            }
        }
    }

    // Nenhum caminho encontrado, realizar backtracking
    path.pop(); // Remove a posição atual do caminho
    if (path.length > 0) {
        const previousMove = path[path.length - 1];
        await move(user, maze, previousMove); // Move de volta para a posição anterior
    }

    return null;
}

async function move(id, maze, newPosition) {
    try {
        const response = await api.move(id, maze, newPosition);
        if (response.pos_atual) {
            movements.push(response.pos_atual);
            return response;
        } else {
            // Movimento ilegal, retorna null
            return null;
        }
    } catch (error) {
        console.error('Erro ao mover:', error);
        return null;
    }
}
