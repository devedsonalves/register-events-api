import { z } from "zod";
import { generateSlug } from "../utils/generate-slug";
import { prisma } from "../lib/prisma";
export async function createEvent(app) {
    app
        .withTypeProvider()
        .post('/events', {
        schema: {
            body: z.object({
                title: z.string().min(4),
                description: z.string(),
                maximumPeoples: z.number().int().positive(),
            }),
            response: {
                201: z.object({
                    id: z.string().uuid(),
                    title: z.string()
                })
            }
        }
    }, async (request, response) => {
        const { title, description, maximumPeoples } = request.body;
        const slug = generateSlug(title);
        const eventWithSameSlug = await prisma.event.findUnique({
            where: { slug }
        });
        if (eventWithSameSlug !== null) {
            throw new Error("Another event with same slug already exists");
        }
        const event = await prisma.event.create({
            data: { title, description, slug, maximumPeoples }
        });
        return response.status(201).send({ id: event.id, title: event.title });
    });
}
//# sourceMappingURL=create-event.js.map