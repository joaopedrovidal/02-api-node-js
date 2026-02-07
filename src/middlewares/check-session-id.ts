import type { FastifyReply, FastifyRequest } from "fastify"

export async function chekcSessionIdExists(request: FastifyRequest, response: FastifyReply) {
    const sessionId = request.cookies.sessionId

    if (!sessionId) {
        return response.status(401).send({
            error: 'Não Autorizado'
        })
    }
}