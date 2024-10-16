import express, { Request, Response, NextFunction } from "express"
import morgan from "morgan"
import cors from 'cors';
import { Configuration } from "./configuration";
import { StatusCodes } from "http-status-codes";
import dotenv from 'dotenv'
import { Database } from "./database";

import { Server } from 'socket.io'; // CODICE MESSO PER SOCKET

dotenv.config()

const PORT: number = parseInt(process.env.EXPRESS_PORT || '3000', 10)
export const app = express();

// CODICE MESSO PER SOCKET
const io = new Server(3001, {
    cors: {
        origin: "http://localhost:5173", // React frontend
        methods: ["GET", "POST"]
    }
});

// Middlewares

app.use(express.json());

app.use(morgan('dev'));

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 202,
    credentials: true
};
app.use(cors(corsOptions));

// Routes

app.post('/assign-counter', function (request, response) {
    const { counterId, serviceNames }: { counterId: number, serviceNames: string[] } = request.body;
    Configuration.assignCounter(counterId, serviceNames);
    response.status(StatusCodes.OK).send({ message: `Counter ${counterId} assigned to services: ${serviceNames.join(", ")}` });
});

app.post('/ticket', async function (request: Request, response: Response, _: NextFunction): Promise<any> {
    const { serviceName }: { serviceName: string | undefined } = request.body;
    if (!serviceName) return response.status(StatusCodes.BAD_REQUEST).send({ error: "Missing serviceName field" })
    const ticketId: number = await Configuration.issueTicket(serviceName || '')
    return response.status(StatusCodes.OK).send({ ticketId: ticketId })
});

app.get('/services', async function (request: Request, response: Response) {
    const services = await Database.getServices();
    response.status(StatusCodes.OK).send(services)
})

app.get('/services/active', async function (request: Request, response: Response) {
    try {
        const activeServices = await Database.getActiveServices();
        response.status(StatusCodes.OK).send(activeServices);
    } catch (error: any) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
    }
});

app.post('/next-customer', function (request, response) {
    let { counterId } = request.body;
    counterId = parseInt(counterId || '', 10)
    try {
        const {nextTicketId, service} = Configuration.callNextCustomer(counterId);
        if (nextTicketId) {
            response.status(StatusCodes.OK).send({ ticketId: nextTicketId, service: service });
        } else {
            response.status(StatusCodes.OK).send({ message: "No clients in queue" });
        }
    } catch (error: any) {
        console.log("Error message: ", error)
        response.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`[server]: Server is running solid and fast at http://localhost:${PORT}`);
});