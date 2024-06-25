import { z } from "zod";
import { prisma } from "../lib/prisma";
export async function checkIn(app) {
    app
        .withTypeProvider()
        .get('/people/:peopleId/check-in', {
        schema: {
            params: z.object({
                peopleId: z.coerce.number().int()
            }),
            response: {
                201: z.object({
                    id: z.number().int(),
                })
            }
        }
    }, async (request, response) => {
        const { peopleId } = request.params;
        const peopleCheckIn = await prisma.checkIn.findUnique({
            where: {
                id: peopleId
            }
        });
        if (peopleCheckIn !== null) {
            throw new Error("People already checked in");
        }
        const checkIn = await prisma.checkIn.create({
            data: {
                peopleId
            }
        });
        return response.status(201).send({ id: checkIn.id });
    });
}
