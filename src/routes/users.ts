import { FastifyInstance } from "fastify";


export async function usersRoutes(app: FastifyInstance) {

  app.get('/', async (request, reply) => {
    console.log('Its working')

    reply.send('Hello world')
  })
}