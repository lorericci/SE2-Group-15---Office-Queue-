import request from 'supertest';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { Configuration } from '../configuration';
import { Database } from '../database';
const app = express(); // Assuming you export the express app from main.ts

jest.mock('../configuration');
jest.mock('../database');

describe('API Endpoints', () => {
    beforeAll(() => {
        jest.clearAllMocks();
    });

    describe('POST /assign-counter', () => {
        it('should assign a counter to services', async () => {
            const response = await request(app)
                .post('/assign-counter')
                .send({ counterId: 1, serviceNames: ['Service1', 'Service2'] });

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body.message).toBe('Counter 1 assigned to services: Service1, Service2');
            expect(Configuration.assignCounter).toHaveBeenCalledWith(1, ['Service1', 'Service2']);
        });
    });

    describe('POST /ticket', () => {
        it('should issue a ticket for a service', async () => {
            (Configuration.issueTicket as jest.Mock).mockResolvedValue(123);

            const response = await request(app)
                .post('/ticket')
                .send({ serviceName: 'Service1' });

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body.ticketId).toBe(123);
            expect(Configuration.issueTicket).toHaveBeenCalledWith('Service1');
        });

        it('should return 400 if serviceName is missing', async () => {
            const response = await request(app)
                .post('/ticket')
                .send({});

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body.error).toBe('Missing serviceName field');
        });
    });

    describe('GET /services', () => {
        it('should return a list of services', async () => {
            const services = [{ id: 1, name: 'Service1' }];
            (Database.getServices as jest.Mock).mockResolvedValue(services);

            const response = await request(app).get('/services');

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body).toEqual(services);
        });
    });

    describe('GET /services/active', () => {
        it('should return a list of active services', async () => {
            const activeServices = [{ id: 1, name: 'Service1' }];
            (Database.getActiveServices as jest.Mock).mockResolvedValue(activeServices);

            const response = await request(app).get('/services/active');

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body).toEqual(activeServices);
        });

        it('should handle errors', async () => {
            (Database.getActiveServices as jest.Mock).mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/services/active');

            expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(response.body.error).toBe('Database error');
        });
    });

    describe('POST /next-customer', () => {
        it('should call the next customer', async () => {
            (Configuration.callNextCustomer as jest.Mock).mockReturnValue(123);

            const response = await request(app)
                .post('/next-customer')
                .send({ counterId: 1 });

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body.ticketId).toBe(123);
            expect(Configuration.callNextCustomer).toHaveBeenCalledWith(1);
        });

        it('should return a message if no clients in queue', async () => {
            (Configuration.callNextCustomer as jest.Mock).mockReturnValue(null);

            const response = await request(app)
                .post('/next-customer')
                .send({ counterId: 1 });

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body.message).toBe('No clients in queue');
        });

        it('should handle errors', async () => {
            (Configuration.callNextCustomer as jest.Mock).mockImplementation(() => {
                throw new Error('Configuration error');
            });

            const response = await request(app)
                .post('/next-customer')
                .send({ counterId: 1 });

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body.error).toBe('Configuration error');
        });
    });

    describe('POST /call-customer', () => {
        it('should call a customer successfully', async () => {
            (Configuration.CallCustomer as jest.Mock).mockResolvedValue(true);

            const response = await request(app)
                .post('/call-customer')
                .send({ customerId: 1 });

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body.message).toBe('Customer 1 called successfully.');
            expect(Configuration.CallCustomer).toHaveBeenCalledWith(1);
        });

        it('should handle call failure', async () => {
            (Configuration.CallCustomer as jest.Mock).mockResolvedValue(false);

            const response = await request(app)
                .post('/call-customer')
                .send({ customerId: 1 });

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body.message).toBe('Failed to call customer 1.');
        });

        it('should handle errors', async () => {
            (Configuration.CallCustomer as jest.Mock).mockImplementation(() => {
                throw new Error('Call error');
            });

            const response = await request(app)
                .post('/call-customer')
                .send({ customerId: 1 });

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body.error).toBe('Call error');
        });
    });
});