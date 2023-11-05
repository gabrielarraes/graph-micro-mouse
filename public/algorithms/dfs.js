import * as api from '../fetch/fetch-maze-api.js'
import { Worker } from 'worker_threads'

export async function run() {
    const userId = 'user';
    let mazes = [];
    let completedWorkers = 0;

    await api.getMazeList().then(mazeList => mazes = JSON.parse(mazeList));

    mazes.forEach((maze, index) => {
        const worker = new Worker("./public/algorithms/dfs-worker.js");
        worker.postMessage({
            userId: `${userId}${index}`,
            maze: maze
        });

        worker.on("message", () => {
            console.log(`worker ${index} completed.`);
            completedWorkers++;

            if(completedWorkers === mazes.length) {
                process.exit();
            }
        })
    })
}


