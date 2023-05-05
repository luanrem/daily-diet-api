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

  app.get('/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const createNewMealParamSchema = z.object({
        id: z.string().uuid()
      })

      const { id } = createNewMealParamSchema.parse(request.params)

      const meal = await knex('meals')
        .where({
          id,
        })

      return {
        meal
      }
    })

  app.get('/all',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {

      const { sessionId } = request.cookies

      const user = await knex('users')
        .where('session_id', sessionId)
        .select()

      console.log(user)

      const meals = await knex('meals').where({
        user_id: user[0].id
      })

      return { meals }
    })

  app.delete('/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const createNewMealParamSchema = z.object({
        id: z.string().uuid()
      })

      const { id } = createNewMealParamSchema.parse(request.params)

      await knex('meals')
        .where({
          id,
        }).delete()

    })
}