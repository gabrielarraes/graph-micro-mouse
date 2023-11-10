import * as api from "../../consumer/maze-api-consumer.js";
import { parentPort } from 'worker_threads';
import { performance } from 'perf_hooks';

let visited = new Set();
let movements = [];

parentPort.on('message', async (data) => {
    let initialPosition = await api.initializeMaze(data.userId, data.maze);
    const startTime = performance.now();
    const finalPath = await bfs(initialPosition, data.userId, data.maze);
    const endTime = performance.now();
    const timeTaken = endTime - startTime;

    if (finalPath) {
        const validationResponse = await api.validatePath(data.userId, data.maze, finalPath);
        console.log(
            'labirinto:', data.maze,
            '| solução é válida:', validationResponse.caminho_valido,
            '| tempo gasto (ms):', timeTaken.toFixed(2),
            '| caminho final:', finalPath
        );
    } else {
        console.log('Nenhum caminho final encontrado.');
    }
});

function findFinalPath(allPaths, initialPosition) {
    for (let [key, path] of allPaths) {
        if (path[path.length - 1] === initialPosition.final) {
            return path;
        }
    }
    return null; // Retorna nulo caso não encontre um caminho final
}

async function bfs(startPosition, user, maze) {
    let queue = [{ position: startPosition, path: [startPosition.pos_atual] }];
    let visited = new Set([startPosition.pos_atual]);

    while (queue.length > 0) {
        let { position, path } = queue.shift();

        if (position.final) {
            return path; // Retorna o caminho assim que encontrar o final
        }

        for (const move of position.movimentos) {
            if (!visited.has(move)) {
                const newPosition = await movePosition(user, maze, move);
                if (newPosition) {
                    visited.add(move);
                    const newPath = [...path, move];
                    queue.push({ position: newPosition, path: newPath });
                }
            }
        }

        // Se não houver movimentos não visitados, volta para o nó anterior
        if (path.length > 1 && !position.movimentos.some(m => !visited.has(m))) {
            const parentPosition = path[path.length - 2];
            const newPosition = await movePosition(user, maze, parentPosition);
            if (newPosition) {
                const newPath = path.slice(0, -1); // Remove o último nó do caminho
                queue.push({ position: newPosition, path: newPath });
            }
        }
    }

    return null; // Retorna null se não encontrar um caminho para o final
}

async function movePosition(id, maze, newPosition) {
    try {
        const response = await api.move(id, maze, newPosition);
        if (response.pos_atual) {
            movements.push(response.pos_atual);
            return response;
        } else {
            // Movimento ilegal, simplesmente retorna null sem imprimir erro
            return null;
        }
    } catch (error) {
        console.error('Error on move:', error);
        return null;
    }
}