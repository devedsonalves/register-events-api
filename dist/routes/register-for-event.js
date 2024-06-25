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
exports.registerForEvent = registerForEvent;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
function registerForEvent(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app
            .withTypeProvider()
            .post('/events/:eventId/peoples', {
            schema: {
                params: zod_1.z.object({
                    eventId: zod_1.z.string().uuid()
                }),
                body: zod_1.z.object({
                    name: zod_1.z.string().min(4),
                    email: zod_1.z.string().email()
                }),
                response: {
                    201: zod_1.z.object({
                        peopleId: zod_1.z.number()
                    })
                }
            }
        }, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const { name, email } = request.body;
            const { eventId } = request.params;
            const peopleFromEmail = yield prisma_1.prisma.people.findUnique({
                where: {
                    email,
                    eventId
                }
            });
            if (peopleFromEmail !== null) {
                throw new Error("You are already registered for this event");
            }
            const [event, amountOfPeopleForEvent] = yield Promise.all([
                prisma_1.prisma.event.findUnique({
                    where: {
                        id: eventId
                    }
                }),
                prisma_1.prisma.people.count({
                    where: {
                        eventId
                    }
                })
            ]);
            const eventIsFull = amountOfPeopleForEvent >= event.maximumPeoples;
            if (eventIsFull) {
                throw new Error("This event is full");
            }
            const people = yield prisma_1.prisma.people.create({
                data: {
                    name,
                    email,
                    eventId
                }
            });
            return response.status(201).send({ peopleId: people.id });
        }));
    });
}
//# sourceMappingURL=register-for-event.js.map