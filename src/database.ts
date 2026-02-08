import 'dotenv/config'
import knex from 'knex'
import type { Knex } from 'knex'
import { env } from './env/index.js'



export const config: Knex.Config = {
    client: env.DATABASE_CLIENT,
    connection: env.DATABASE_CLIENT === 'sqlite'
        ? {
            filename: env.DATABASE_CLIENT
        } : env.DATABASE_CLIENT,
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations'
    }
}

export const SQL = knex(config)