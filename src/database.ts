import 'dotenv/config'
import knex from 'knex'
import type { Knex } from 'knex'
import { env } from './env/index.js'



export const config: Knex.Config = {
    client: env.DATATBASE_CLIENT,
    connection: env.DATATBASE_CLIENT === 'sqlite'
        ? {
            filename: env.DATATBASE_CLIENT
        } : env.DATATBASE_CLIENT,
    useNullAsDefault: true,
    migrations: {
        extension: 'ts',
        directory: './db/migrations'
    }
}

export const SQL = knex(config)