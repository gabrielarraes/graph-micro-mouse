import { Client, request } from 'undici';
import fetch from "node-fetch";

const baseUrl = 'https://gtm.delary.dev'

export async function getMazeList() {
    const mazeListResponse = await fetch(`${baseUrl}/labirintos`);

    const response= await request(`${baseUrl}/labirintos`)
    return await response.body.json();
}

export async function initializeMaze(userId, maze) {
    const startMazeResponse =
        await request(`${baseUrl}/iniciar`, {
            headers: { "Content-type": "application/json" },
            method: "POST",
            body: JSON.stringify({ id: userId, labirinto: maze })
        });

    const responseBody = await startMazeResponse.body.json();

    if(startMazeResponse.statusCode !== 200) {
        console.log("Start maze error: ", responseBody)
    }

    return responseBody
}

export async function validatePath(userId, maze, moviments) {
    const validate = await request(`${baseUrl}/validar_caminho`, {
        headers: { "Content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({ id: userId, labirinto: maze, todos_movimentos: moviments })
    });

    return await validate.body.json();
}

export async function move(id, maze, newPosition) {

    const moveResposne = await request(`${baseUrl}/movimentar`, {
        headers: { "Content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({ id: id, labirinto: maze, nova_posicao: newPosition })
    })

    const responseBody = await moveResposne.body.json();

    if(moveResposne.statusCode !== 200) {
        console.log("Error on move response:",responseBody)
    }

    return responseBody
}
