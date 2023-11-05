import fetch from 'node-fetch';

const baseUrl = 'https://gtm.delary.dev'

export async function getMazeList() {
    const mazeListResponse = await fetch(`${baseUrl}/labirintos`);
    return mazeListResponse.json();
}

export async function initializeMaze(userId, maze) {
    const startMazeResponse =
        await fetch(`${baseUrl}/iniciar`, {
            headers: { "Content-type": "application/json" },
            method: "POST",
            body: JSON.stringify({ id: 'user', labirinto: maze })
        });

    return startMazeResponse.json();
}

export async function validatePath(userId, maze, moviments) {
    const validate = await fetch(`${baseUrl}/validar_caminho`, {
        headers: { "Content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({ id: userId, labirinto: maze, todos_movimentos: moviments })
    });

    return validate.json();
}

export async function move(id, maze, newPosition) {
    const moveResposne = await fetch(`${baseUrl}/movimentar`, {
            headers: { "Content-type": "application/json" },
            method: "POST",
            body: JSON.stringify({ id: id, labirinto: maze, nova_posicao: newPosition })
        });

    return moveResposne.json();
}
