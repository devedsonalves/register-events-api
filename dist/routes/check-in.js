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
exports.checkIn = checkIn;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
function checkIn(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app
            .withTypeProvider()
            .get('/people/:peopleId/check-in', {
            schema: {
                params: zod_1.z.object({
                    peopleId: zod_1.z.coerce.number().int()
                }),
                response: {
                    201: zod_1.z.object({
                        id: zod_1.z.number().int(),
                    })
                }
            }
        }, (request, response) => __awaiter(this, void 0, void 0, function* () {
            const { peopleId } = request.params;
            const peopleCheckIn = yield prisma_1.prisma.checkIn.findUnique({
                where: {
                    id: peopleId
                }
            });
            if (peopleCheckIn !== null) {
                throw new Error("People already checked in");
            }
            const checkIn = yield prisma_1.prisma.checkIn.create({
                data: {
                    peopleId
                }
            });
            return response.status(201).send({ id: checkIn.id });
        }));
    });
}
//# sourceMappingURL=check-in.js.map