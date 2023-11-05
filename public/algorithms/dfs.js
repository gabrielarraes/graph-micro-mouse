import * as api from '../fetch/fetch-maze-api.js'

let visited = new Set();
let moviments = [];

export async function run() {
    const userId = 'user';
    let maze = '';
    let mazes = [];
    let initialPosition = {
        pos_atual: 0,
        inicio: false,
        final: false,
        movimentos: []
    };

    await api.getMazeList().then(mazeList => {
        mazes = mazeList;
        maze = mazes[2];
    });

    await api.initializeMaze(userId, maze).then(start => {
        initialPosition = start
        moviments.push(start.pos_atual);
    });

    await dfs(initialPosition, userId, maze);

    return await api.validatePath(userId, maze, moviments);
}

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
        } else if(child === position.movimentos[position.movimentos.length - 1]) {
            await move(user, maze, parent);
        }
    }
}

async function move(id, maze, newPosition) {
    let result = {}

    await api.move(id, maze, newPosition).then(res => {
        moviments.push(res.pos_atual);
        result = res;
    });

    return result;
}
