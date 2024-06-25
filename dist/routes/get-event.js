"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvent = getEvent;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
function getEvent(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app
            .withTypeProvider()
            .get('/events/:eventId', {
            schema: {
                params: zod_1.z.object({
                    eventId: zod_1.z.string().uuid()
                }),
                response: {
                    200: zod_1.z.object({
                        id: zod_1.z.string().uuid(),
                        title: zod_1.z.string(),
                        description: zod_1.z.string(),
                        maximumPeoples: zod_1.z.number().int().positive(),
                        slug: zod_1.z.string(),
                        peoples: zod_1.z.array(zod_1.z.object({
                            id: zod_1.z.number(),
                            name: zod_1.z.string().min(4),
                            email: zod_1.z.string().email()
                        }))
                    })
                }
            }
        }, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const { eventId } = request.params;
            const event = yield prisma_1.prisma.event.findUnique({
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
            });
            if (event === null) {
                throw new Error("Event not found");
            }
            return response.status(200).send(event);
        }));
    });
}
//# sourceMappingURL=get-event.js.map