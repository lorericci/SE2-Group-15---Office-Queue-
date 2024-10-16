import { Queue } from '../queue';
import { Service } from '../service';

const service: Service = new Service('test-service-1', 12);

describe('Queue', () => {
    let queue: Queue;

    beforeEach(() => {
        queue = new Queue(service)
    })

    test('should initialize with an empty queue', () => {
        expect(queue.length).toBe(0);
    });

    test('should return the service instance', () => {
        expect(queue.service).toBe(service);
    });

    test('should enqueue a ticket id', () => {
        queue.enqueue(1);
        expect(queue.length).toBe(1);
    });

    test('should throw an error when enqueuing a non-positive ticket id', () => {
        expect(() => queue.enqueue(0)).toThrow('ticket id must be positive');
        expect(() => queue.enqueue(-1)).toThrow('ticket id must be positive');
    });

    test('should dequeue the next customer', () => {
        queue.enqueue(1);
        queue.enqueue(2);
        expect(queue.nextCustomer()).toBe(1);
        expect(queue.length).toBe(1);
        expect(queue.nextCustomer()).toBe(2);
        expect(queue.length).toBe(0);
    });

    test('should return undefined when dequeuing from an empty queue', () => {
        expect(queue.nextCustomer()).toBeUndefined();
    });
});