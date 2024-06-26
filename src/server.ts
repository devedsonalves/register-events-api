import fastify from "fastify"
import { validatorCompiler, serializerCompiler } from "fastify-type-provider-zod"

import { createEvent } from "./routes/create-event"
import { registerForEvent } from "./routes/register-for-event"
import { getEvent } from "./routes/get-event"
import { getPeopleBadge } from "./routes/get-people-badge"
import { checkIn } from "./routes/check-in"
import { getEventPeoples } from "./routes/get-event-peoples"
import { getAllEvents } from "./routes/get-all-events"

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(checkIn)
app.register(createEvent)
app.register(getAllEvents)
app.register(getEventPeoples)
app.register(getEvent)
app.register(getPeopleBadge)
app.register(registerForEvent)

app.listen({ port: 3000 })   
  .then(() => console.log('Listening on port: { 3000 } 🔥'))
  .catch((e) => console.error('Error: ' + e))
  