import fastify from 'fastify'

const app = fastify()

app.get('/hello', () => {
    return 'Hello Wolrd'
})

app.listen({
    port: 3333,
}).then(() => {
    console.log('HTTP Server Runing!')
})