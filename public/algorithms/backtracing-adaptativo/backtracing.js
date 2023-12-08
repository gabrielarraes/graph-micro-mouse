import * as api from '../../consumer/maze-api-consumer.js'
import { Worker } from 'worker_threads'

export async function run() {
    const userId = 'user';
    let mazes = [];
    let completedWorkers = 0;

    await api.getMazeList().then(mazeList => mazes = mazeList);

    mazes.forEach((maze, index) => {
        const worker = new Worker("./public/algorithms/backtracing-adaptativo/backtracing-worker.js");

        worker.postMessage({
            userId: `${userId}${index}`,
            maze: maze
        });

        worker.on("message", () => {
            completedWorkers++;

            if(completedWorkers === mazes.length) {
                process.exit();
            }
        })
    })
}


