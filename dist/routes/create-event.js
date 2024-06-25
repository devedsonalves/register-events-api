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
exports.createEvent = createEvent;
const zod_1 = require("zod");
const generate_slug_1 = require("../utils/generate-slug");
const prisma_1 = require("../lib/prisma");
function createEvent(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app
            .withTypeProvider()
            .post('/events', {
            schema: {
                body: zod_1.z.object({
                    title: zod_1.z.string().min(4),
                    description: zod_1.z.string(),
                    maximumPeoples: zod_1.z.number().int().positive(),
                }),
                response: {
                    201: zod_1.z.object({
                        id: zod_1.z.string().uuid(),
                        title: zod_1.z.string()
                    })
                }
            }
        }, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const { title, description, maximumPeoples } = request.body;
            const slug = (0, generate_slug_1.generateSlug)(title);
            const eventWithSameSlug = yield prisma_1.prisma.event.findUnique({
                where: { slug }
            });
            if (eventWithSameSlug !== null) {
                throw new Error("Another event with same slug already exists");
            }
            const event = yield prisma_1.prisma.event.create({
                data: { title, description, slug, maximumPeoples }
            });
            return response.status(201).send({ id: event.id, title: event.title });
        }));
    });
}
//# sourceMappingURL=create-event.js.map