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
exports.getEventPeoples = getEventPeoples;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
function getEventPeoples(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app
            .withTypeProvider()
            .get('/events/:eventId/people', {
            schema: {
                params: zod_1.z.object({
                    eventId: zod_1.z.string().uuid()
                }),
                querystring: zod_1.z.object({
                    query: zod_1.z.string().nullish(),
                    pageIndex: zod_1.z.string().nullish().default("0").transform(Number)
                }),
                response: {}
            }
        }, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const { eventId } = request.params;
            const { pageIndex, query } = request.query;
            const peoples = yield prisma_1.prisma.people.findMany({
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
        }));
    });
}
//# sourceMappingURL=get-event-peoples.js.map