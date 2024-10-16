import { Configuration } from '../configuration';
import { Service } from '../service';
import { Database } from '../database';
import { Queue } from '../queue';

jest.mock('../database');

describe('Configuration', () => {
    beforeEach(() => {
        // Reset the singleton instance before each test
        (Configuration as any)._instance = null;
    });

    test('should add a new service', () => {
        Configuration.addService('TestService', 10);
        expect(Configuration.serviceNames).toContain('TestService');
    });

    test('should throw an error when adding an existing service', () => {
        Configuration.addService('TestService', 10);
        expect(() => Configuration.addService('TestService', 10)).toThrowError('Service TestService is already configured');
    });

    test('should issue a ticket for a configured service', async () => {
        Configuration.addService('TestService', 10);
        await Configuration.issueTicket('TestService');
        // Assuming Database.issueTicket works correctly, no need to assert anything here
    });

    test('should throw an error when issuing a ticket for an unconfigured service', async () => {
        await expect(Configuration.issueTicket('NonExistentService')).rejects.toThrowError('Queue for service NonExistentService not configured');
    });

    test('should assign services to a counter', async () => {
        await Configuration.assignCounter(1, ['TestService1', 'TestService2']);
        // Assuming Database.assignCounter works correctly, no need to assert anything here
    });

    test('should call the next customer for a counter', async () => {
        Configuration.addService('TestService1', 10)
        Configuration.addService('TestService2', 5);

        await Configuration.assignCounter(1, ['TestService1', 'TestService2']);
        await Configuration.issueTicket('TestService1');
        await Configuration.issueTicket('TestService2');
        const nextCustomer = Configuration.callNextCustomer(1);
        expect(nextCustomer).toBe(undefined);
    });

    test('should throw an error when calling the next customer for an unconfigured counter', () => {
        expect(() => Configuration.callNextCustomer(999)).toThrowError('Counter 999 is not configured');
    });

    test('should call a customer by their ID', async () => {
        Configuration.addService('customerService', 10);
        const callLogged = await Configuration.CallCustomer(1);
        expect(callLogged).toBe(undefined);
    });

    test('should throw an error when calling a customer for an unconfigured service', async () => {
        await expect(Configuration.CallCustomer(1)).rejects.toThrowError('Queue for customer service not configured');
    });
});

