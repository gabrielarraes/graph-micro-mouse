import fetch from "node-fetch";

let path = [];

export async function run() {
    let mazes = [];
    let initialPosition = {
        pos_atual: 0,
        inicio: false,
        final: false,
        movimentos: []
    };

    const mazeListResponse =
        await fetch('https://gtm.delary.dev/labirintos');
    await mazeListResponse.json().then(mazeList => mazes = mazeList);

    const startMazeResponse =
        await fetch('https://gtm.delary.dev/labirintos', {
            headers: { "Content-type": "application/json" },
            method: 'POST',
            body: JSON.stringify({ id: 'user', labirinto: mazes[0] })
        });
    await startMazeResponse.json().then(start => initialPosition = start)

    console.log(labs)
    return;
}

export async function dfs(graph, node) {

    path.push(`${node} -> `);
    graph[node].visited = true;

    for(const child of graph[node].list) {
        if(!graph[child].visited) {
            run(graph, child)
        } else {
            return;
        }
    }

    path.forEach(p => console.log(p));
}
