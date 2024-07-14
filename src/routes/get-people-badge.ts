import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getPeopleBadge(app: FastifyInstance) { 
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/peoples/:peopleId/badge', {
      schema: {
        params: z.object({
          peopleId: z.coerce.number().int()
        }),
        response: {
          200: z.object({
            name: z.string().min(4),
            email: z.string().email(),
            checkInUrl: z.string().url(),
            event: z.object({
              title: z.string()
            })
          })
        }
      }
    }, async (request, response) => {
      const { peopleId } = request.params;
      
      const people = await prisma.people.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true
            }
          }
        },
        where: {
          id: peopleId
        }
      })

      if (people === null) {
        throw new Error("People not found")
      }

      const baseUrl = `${request.protocol}://${request.url}`
      const checkInUrl = new URL(`/peoples/${peopleId}/check-in`, baseUrl)

      return response.status(200).send({
        name: people.name,
        email: people.email,
        checkInUrl: checkInUrl.toString(),
        event: {
          title: people.event.title
        }
      })
    }
  )
}