import fastify from 'fastify'
import { SQL } from './database.js'
import { randomUUID } from 'node:crypto'
import { env } from './env/index.js'

const app = fastify()

app.get('/hello', async () => {
    const transaction = await SQL('transactions')
    .where('title', 'Teste2')
    .select('*')

    return transaction
})

app.listen({
    port: env.PORT,
}).then(() => {
    console.log('HTTP Server Runing!')
})