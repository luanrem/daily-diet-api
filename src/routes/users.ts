import { FastifyInstance } from "fastify";
import { randomUUID } from 'node:crypto'
import { knex } from "../database";
import { z } from "zod";


export async function usersRoutes(app: FastifyInstance) {

  app.get('/', async (request, reply) => {
    console.log('Its working')
    const createNewUser = await knex('users').insert({
      id: randomUUID(),
      name: 'Luan Roberto Estrada Martins',
      email: 'luanrem@gmail.com'
    }).returning('*')

    console.log(createNewUser)
    const table = await knex('users').select('*')
    console.log(table)

    reply.send('Hello world')
  })

  app.post('/', async (request, reply) => {
    const createNewUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email()
    })

    const { name, email } = createNewUserBodySchema.parse(request.body)

    console.log('name, email', name, email)

    const createNewUser = await knex('users').insert({
      id: randomUUID(),
      name,
      email
    }).returning('*')

    return reply.status(201).send(createNewUser[0])
  })
}