import { Queue } from '../queue';
import { Service } from '../service';

describe('Queue', () => {
    let queue: Queue;
    let service: Service;

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create an instance with the correct service', () => {
        expect(queue.service).toBe(service);
    });

    test('should start with an empty queue', () => {
        expect(queue.length).toBe(0);
    });

    test('should enqueue a ticketId', () => {
        queue.enqueue(5);
        expect(queue.length).toBe(1);
    });

    test('should not enqueue a negative ticketId', () => {
        expect(() => queue.enqueue(-1)).toThrow('ticket id must be positive');
    });

    test('should return the next customer in line', () => {
        queue.enqueue(1);
        queue.enqueue(2);
        expect(queue.nextCustomer()).toBe(1);
        expect(queue.nextCustomer()).toBe(2);
    });

    test('should return undefined when no customers are in the queue', () => {
        expect(queue.nextCustomer()).toBeUndefined();
    });
});
