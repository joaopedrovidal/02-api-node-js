import fastify from 'fastify'
import { env } from './env/index.js'
import { transactionsRoutes } from './routes/transactions.js'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyCookie)

app.register(transactionsRoutes, {
    prefix: 'transactions'
})