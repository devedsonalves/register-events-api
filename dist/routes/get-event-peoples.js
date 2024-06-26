import { z } from "zod";
import { prisma } from "../lib/prisma";
export async function getEventPeoples(app) {
    app
        .withTypeProvider()
        .get('/events/:eventId/people', {
        schema: {
            params: z.object({
                eventId: z.string().uuid()
            }),
            querystring: z.object({
                query: z.string().nullish(),
                pageIndex: z.string().nullish().default("0").transform(Number)
            }),
            response: {}
        }
    }, async (request, response) => {
        const { eventId } = request.params;
        const { pageIndex, query } = request.query;
        const peoples = await prisma.people.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                eventId: true,
                checkIn: {
                    select: {
                        createtAt: true
                    }
                }
            },
            where: query ? {
                eventId,
                name: {
                    contains: query
                }
            } : {
                eventId
            },
            take: 10,
            skip: pageIndex * 10,
            orderBy: {
                createdAt: "desc"
            }
        });
        return response.status(200).send(peoples);
    });
}
//# sourceMappingURL=get-event-peoples.js.map