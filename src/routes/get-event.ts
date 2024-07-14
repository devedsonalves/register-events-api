import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId', {
      schema: {
        params: z.object({
          eventId: z.string().uuid()
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            title: z.string(),
            description: z.string(),
            maximumPeoples: z.number().int().positive(),
            slug: z.string(),
            peoples: z.array(z.object({
              id: z.number(),
              name: z.string().min(4),
              email: z.string().email()
            }))
          })
        }
      }
    }, async (request , response) => {
      const { eventId } = request.params

      const event = await prisma.event.findUnique({
        select: {
          id: true,
          title: true,
          description: true,
          maximumPeoples: true,
          slug: true,
          peoples: true
        },
        where: {
          id: eventId
        }
      })

      if (event === null) {
        throw new Error("Event not found")
      }

      return response.status(200).send(event)
    }
  )
}