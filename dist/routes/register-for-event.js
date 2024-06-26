import { z } from "zod";
import { prisma } from "../lib/prisma";
export async function registerForEvent(app) {
    app
        .withTypeProvider()
        .post('/events/:eventId/peoples', {
        schema: {
            params: z.object({
                eventId: z.string().uuid()
            }),
            body: z.object({
                name: z.string().min(4),
                email: z.string().email()
            }),
            response: {
                201: z.object({
                    peopleId: z.number()
                })
            }
        }
    }, async (request, response) => {
        const { name, email } = request.body;
        const { eventId } = request.params;
        const peopleFromEmail = await prisma.people.findUnique({
            where: {
                email,
                eventId
            }
        });
        if (peopleFromEmail !== null) {
            throw new Error("You are already registered for this event");
        }
        const [event, amountOfPeopleForEvent] = await Promise.all([
            prisma.event.findUnique({
                where: {
                    id: eventId
                }
            }),
            prisma.people.count({
                where: {
                    eventId
                }
            })
        ]);
        const eventIsFull = amountOfPeopleForEvent >= event.maximumPeoples;
        if (eventIsFull) {
            throw new Error("This event is full");
        }
        const people = await prisma.people.create({
            data: {
                name,
                email,
                eventId
            }
        });
        return response.status(201).send({ peopleId: people.id });
    });
}
//# sourceMappingURL=register-for-event.js.map