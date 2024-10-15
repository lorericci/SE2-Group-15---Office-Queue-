import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { Configuration } from '../configuration';
import { StatusCodes } from 'http-status-codes';
import dotenv from 'dotenv';
import { Database } from '../database';

dotenv.config();

const PORT: number = parseInt(process.env.EXPRESS_PORT || '3000', 10);
const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 202,
    credentials: true
};
app.use(cors(corsOptions));

// Sample route for testing
app.get('/test', (req, res) => {
    res.status(StatusCodes.OK).send({ message: 'Server is running' });
});

// Routes
app.post('/assign-counter', function (request, response) {
    const { counterId, serviceNames }: { counterId: number, serviceNames: string[] } = request.body;
    Configuration.assignCounter(counterId, serviceNames);
    response.status(StatusCodes.OK).send({ message: `Counter ${counterId} assigned to services: ${serviceNames.join(", ")}` });
});

app.post('/ticket', async function (request: Request, response: Response, _: NextFunction): Promise<any> {
    const { serviceName }: { serviceName: string | undefined } = request.body;
    if (!serviceName) return response.status(StatusCodes.BAD_REQUEST).send({ error: "Missing serviceName field" });
    const ticketId: number = await Configuration.issueTicket(serviceName || '');
    return response.status(StatusCodes.OK).send({ ticketId: ticketId });
});

app.get('/services', async function (request: Request, response: Response) {
    const services = await Database.getServices();
    response.status(StatusCodes.OK).send(services);
});

app.get('/services/active', async function (request: Request, response: Response) {
    try {
        const activeServices = await Database.getActiveServices();
        response.status(StatusCodes.OK).send(activeServices);
    } catch (error: any) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: error.message });
    }
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

app.post('/call-customer', async function (request: Request, response: Response) {
    const { customerId }: { customerId: number } = request.body;
    try {
        const callSuccess = await Configuration.CallCustomer(customerId);
        if (callSuccess) {
            response.status(StatusCodes.OK).send({ message: `Customer ${customerId} called successfully.` });
        } else {
            response.status(StatusCodes.BAD_REQUEST).send({ message: `Failed to call customer ${customerId}.` });
        }
    } catch (error: any) {
        response.status(StatusCodes.BAD_REQUEST).send({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`[server]: Server is running solid and fast at http://localhost:${PORT}`);
});

// Tests
import { Server } from 'http';

let server: Server;
let agent: request.SuperTest<request.Test>;

beforeAll((done) => {
    server = app.listen(PORT, (err?: any) => {
        if (err) {
            return done(err);
        }
        agent = request.agent(server);
        done();
    });
});

afterAll((done) => {
    return server && server.close(done);
});

describe('Express Routes', () => {
    test('POST /assign-counter', async () => {
        const response = await agent.post('/assign-counter')
            .send({ counterId: 1, serviceNames: ["Atm", "Financial"] });
        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body.message).toBe('Counter 1 assigned to services: Atm, Financial');
    });

    test('POST /ticket', async () => {
        const response = await agent.post('/ticket')
            .send({ serviceName: 'Shipping' });
        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body.ticketId).toBeDefined();
    });

    test('GET /services', async () => {
        const response = await agent.get('/services');
        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toBeDefined();
    });

    test('GET /services/active', async () => {
        const response = await agent.get('/services/active');
        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body).toBeDefined();
    });

    test('POST /next-customer', async () => {
        const response = await agent.post('/next-customer')
            .send({ counterId: 1 });
        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body.ticketId).toBeDefined();
    });

    test('POST /call-customer', async () => {
        const response = await agent.post('/call-customer')
            .send({ customerId: 1 });
        expect(response.status).toBe(StatusCodes.OK);
        expect(response.body.message).toBe('Customer 1 called successfully.');
    });
});