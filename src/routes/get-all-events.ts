import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getAllEvents(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/events', {
      schema: {
        querystring: z.object({
          pageIndex: z.string().nullish().default("0").transform(Number)
        }),
        response: {}
      }
    }, async (request , response) => {
      const { pageIndex } = request.query

      const peoples = await prisma.event.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          maximumPeoples: true,
          slug: true,
          peoples: true
        },
        orderBy: {
          slug: "asc"
        },
        take: 10,
        skip: pageIndex * 10
      })

      return response.status(200).send(peoples)
    }
  )
}