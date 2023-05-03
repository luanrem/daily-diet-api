import { FastifyInstance } from "fastify";
import crypto from 'node:crypto'
import { knex } from "../database";


export async function usersRoutes(app: FastifyInstance) {

  app.get('/', async (request, reply) => {
    console.log('Its working')
    const createNewUser = await knex('users').insert({
      id: crypto.randomUUID(),
      name: 'Luan Roberto Estrada Martins',
      email: 'luanrem@gmail.com'
    }).returning('*')

    console.log(createNewUser)
    const table = await knex('users').select('*')
    console.log(table)

    reply.send('Hello world')
  })
}