import express from "express"
import { Configuration } from "./configuration";
import { StatusCodes } from "http-status-codes"
import dotenv from 'dotenv'

// Server configuration

dotenv.config()

const PORT: number = parseInt(process.env.EXPRESS_PORT || '3000', 10)
const app = express();

app.use(express.json())

// Routes

app.post('/assign-counter', function (request, response) {
    const { counterId, serviceNames }: { counterId: number, serviceNames: string[] } = request.body;
    Configuration.assignCounter(counterId, serviceNames);
    response.status(StatusCodes.OK).send({ message: `Counter ${counterId} assigned to services: ${serviceNames.join(", ")}` });
});

app.post('/ticket', function (request, response) {
    const { serviceName }: { serviceName: string } = request.body;
    const ticketId: number = Configuration.issueTicket(serviceName)
    response.status(StatusCodes.OK).send({ ticketId: ticketId })
});

app.post('/next-customer', function (request, response) {
    const { counterId }: { counterId: number } = request.body;
    try {
        const nextTicketId = Configuration.callNextCustomer(counterId);
        if (nextTicketId) {
            response.status(StatusCodes.OK).send({ ticketId: nextTicketId });
        } else {
            response.status(StatusCodes.OK).send({ message: "No clients in queue" });
        }
    } catch (error: any) {
        response.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
    }
});

// Server startup

app.listen(PORT, () => {
    console.log(`[server]: Server is running solid and fast at http://localhost:${PORT}`);
});