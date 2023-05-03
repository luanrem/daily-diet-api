import { FastifyInstance } from "fastify";
import { knex } from "../database";


export async function usersRoutes(app: FastifyInstance) {

  app.get('/', async (request, reply) => {
    console.log('Its working')
    const table = await knex('sqlite_schema').select('*')
    console.log(table)

    reply.send('Hello world')
  })
}