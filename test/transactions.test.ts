import { test, beforeAll, afterAll, describe, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import { beforeEach } from 'vitest'

describe('Transactions routes', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

    test('o usuário consegue criar um nova transação', async () => {
        await request(app.server)
            .post('/transactions')
            .send({
                amount: 5000,
                type: 'credit',
                title: 'testando o teste automatizado',
            })
            .expect(201)
    })

    test('O usuário pode conseguir listar as transações', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                amount: 5000,
                type: 'credit',
                title: 'testando o teste automatizado',
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', String(cookies))
            .expect(200)

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'testando o teste automatizado',
                amount: 5000,
            })
        ])
    })

    test('O usuário consegue listar uma transação específica', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                amount: 5000,
                type: 'credit',
                title: 'testando o teste automatizado',
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', String(cookies))
            .expect(200)

        const transactionsId = listTransactionsResponse.body.transactions[0].id

        const getTransactionRepose = await request(app.server)
            .get(`/transactions/${transactionsId}`)
            .set('Cookie', String(cookies))
            .expect(200)

        expect(getTransactionRepose.body.transaction).toEqual(
            expect.objectContaining({
                title: 'testando o teste automatizado',
                amount: 5000,
            })
        )
    })

    test('O usuário consegue ver o resumo', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                amount: 5000,
                type: 'credit',
                title: 'Credit Transaction',
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        await request(app.server)
            .post('/transactions')
            .set('Cookie', String(cookies))
            .send({
                amount: 2000,
                type: 'debit',
                title: 'Debit transaction',
            })

        const summaryResponse = await request(app.server)
            .get('/transactions/summary')
            .set('Cookie', String(cookies))
            .expect(200)

        expect(summaryResponse.body.summary).toEqual(
            expect.objectContaining({
                amount: 3000
            })
        )
    })
})
