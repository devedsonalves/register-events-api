"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = require("fastify");
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const create_event_1 = require("./routes/create-event");
const register_for_event_1 = require("./routes/register-for-event");
const get_event_1 = require("./routes/get-event");
const get_people_badge_1 = require("./routes/get-people-badge");
const check_in_1 = require("./routes/check-in");
const get_event_peoples_1 = require("./routes/get-event-peoples");
const app = (0, fastify_1.default)();
app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
app.register(create_event_1.createEvent);
app.register(register_for_event_1.registerForEvent);
app.register(get_event_1.getEvent);
app.register(get_people_badge_1.getPeopleBadge);
app.register(check_in_1.checkIn);
app.register(get_event_peoples_1.getEventPeoples);
app.listen({ port: 3000 })
    .then(() => console.log('Listening on port: { 3000 } 🔥'))
    .catch((e) => console.error('Error: ' + e));
//# sourceMappingURL=server.js.map