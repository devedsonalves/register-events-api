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
exports.getPeopleBadge = getPeopleBadge;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
function getPeopleBadge(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app
            .withTypeProvider()
            .get('/peoples/:peopleId/badge', {
            schema: {
                params: zod_1.z.object({
                    peopleId: zod_1.z.coerce.number().int()
                }),
                response: {
                    200: zod_1.z.object({
                        name: zod_1.z.string().min(4),
                        email: zod_1.z.string().email(),
                        checkInUrl: zod_1.z.string().url(),
                        event: zod_1.z.object({
                            title: zod_1.z.string()
                        })
                    })
                }
            }
        }, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const { peopleId } = request.params;
            const people = yield prisma_1.prisma.people.findUnique({
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
            });
            if (people === null) {
                throw new Error("People not found");
            }
            const baseUrl = `${request.protocol}://${request.url}`;
            const checkInUrl = new URL(`/peoples/${peopleId}/check-in`, baseUrl);
            return response.status(200).send({
                name: people.name,
                email: people.email,
                checkInUrl: checkInUrl.toString(),
                event: {
                    title: people.event.title
                }
            });
        }));
    });
}
//# sourceMappingURL=get-people-badge.js.map