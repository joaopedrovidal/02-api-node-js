import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { SQL } from "../database.js";
import { randomUUID } from "node:crypto";
import { chekcSessionIdExists } from "../middlewares/check-session-id.js";

export async function transactionsRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async(request, response) => {
        console.log(`[${request.method}, ${request.url}]`)
    })


    app.get('/summary', {
        preHandler: [chekcSessionIdExists]
    }, async (request) => {

        const { sessionId } = request.cookies

        const summary = await SQL('transactions')
            .where('sesion_id', sessionId)
            .sum('amount', { as: 'amount' })
            .first()

        return { summary }
    })

    app.get('/', {
        preHandler: [chekcSessionIdExists]
    }, async (request, response) => {

        const { sessionId } = request.cookies

        const transactions = await SQL('transactions')
            .where('sesion_id', sessionId)
            .select()

        return { transactions }
    })

    app.get('/:id', {
        preHandler: [chekcSessionIdExists]
    }, async (request) => {
        const getTransactionParamsSchema = z.object({
            id: z.string().uuid(),
        })

        const params = getTransactionParamsSchema.parse(request.params)

        const { sessionId } = request.cookies

        const transaction = await SQL('transactions')
            .where({
                sesion_id: sessionId,
                id: params.id
            })
            .first()

        return {
            transaction
        }
    })

    app.post('/', async (request, response) => {
        const createTransactiosnBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit']),
        })

        const body = createTransactiosnBodySchema.parse(request.body)

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            sessionId = randomUUID()

            response.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7 //7 dias 
            })
        }

        await SQL('transactions').insert({
            id: randomUUID(),
            title: body.title,
            amount: body.type === 'credit' ? body.amount : body.amount * -1,
            sesion_id: sessionId
        })

        return response.status(201).send()
    })
}