import { FastifyInstance } from "fastify";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";
import { knex } from "../database";
import { z } from "zod";
import { randomUUID } from "crypto";
import { format } from "date-fns";

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    console.log(`[${request.method}] ${request.url}`)
  })

  app.post('/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const createNewMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date_time: z.string(),
        is_on_diet: z.boolean()
      })

      const { name, description, date_time, is_on_diet } = createNewMealBodySchema.parse(request.body)

      const { sessionId } = request.cookies

      const newDate = format(new Date(date_time), "yyyy'-'MM'-'dd' 'HH:mm:ss")

      const user = await knex('users')
        .where('session_id', sessionId)
        .select()

      const meal = await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        date_time: newDate,
        is_on_diet,
        user_id: user[0].id
      }).returning('*')

      return { meal }
    })
}