import { FastifyInstance } from "fastify";
import { randomUUID } from 'node:crypto'
import { knex } from "../database";
import { z } from "zod";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";


export async function usersRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.get('/me',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {

      const { sessionId } = request.cookies

      const user = await knex('users')
        .where('session_id', sessionId)
        .select()

      return {
        user
      }
    })

  app.get('/all', async (request, reply) => {
    const users = await knex('users').select('*')

    return {
      users
    }
  })

  app.delete('/all', async (request, reply) => {
    await knex('users').delete('*')
  })

  app.post('/', async (request, reply) => {
    const createNewUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email()
    })

    const { name, email } = createNewUserBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    const createNewUser = await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId
    }).returning('*')

    return reply.status(201).send(createNewUser[0])
  })
}