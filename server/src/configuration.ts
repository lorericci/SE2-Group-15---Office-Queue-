import { Queue } from "./queue";
import { Service } from "./service";

export class Configuration { // Implements the Singleton pattern
    private static _instance: Configuration | null = null;
    private queues: Map<string, Queue> // Map<service name, respective queue>
    private counters: Map<number, string[]>; // Map<counter id, list of service names>
    private ticketId: number

    private constructor() {
        this.queues = new Map<string, Queue>()
        this.counters = new Map<number, string[]>()
        this.ticketId = 1
    }

    public static get instance(): Configuration {
        if (!Configuration._instance) {
            Configuration._instance = new Configuration();
        }
        return Configuration._instance;
    }

    /**
     * Configure a service (create a queue)
     * @param serviceName 
     * @param expectedDuration - time it takes to serve a customer, in seconds 
     */
    public static addService(serviceName: string, expectedDuration: number) {
        const config = Configuration.instance
        if (config.queues.has(serviceName)) { throw new Error(`Service ${serviceName} is already configured`) }
        const service = new Service(serviceName, expectedDuration)
        const queue = new Queue(service);
        config.queues.set(serviceName, queue)
    }

    /** 
     * @returns the names of the configured services 
     */
    public static get serviceNames(): string[] {
        return [...Configuration.instance.queues.keys()]
    }

    /**
     * Put a customer in queue and issue him a ticket
     * @param serviceName - type of service requested
     * @returns the id of the issued ticket
     */
    public static issueTicket(serviceName: string): number {
        const queue: Queue | undefined = Configuration.instance.queues.get(serviceName)
        if (!queue) { throw new Error(`Queue for service ${serviceName} not configured`) }
        Configuration.instance.ticketId++
        const issuedTicketId = Configuration.instance.ticketId
        queue.enqueue(issuedTicketId)
        return issuedTicketId
    }

    /**
     * Assign a list of services to a counter
     * @param {number} counterId - The unique counter identifier
     * @param {string[]} serviceNames - An array of service names that the counter can handle
     */
    public static assignCounter(counterId: number, serviceNames: string[]) {
        const config = Configuration.instance;
        config.counters.set(counterId, serviceNames);
    }

    /**
     * Call the next customer to a specified counter
     * 
     * The next customer is selected from the longest queue among the services that the counter can handle
     * In case of queues of equal length, the service with the lowest service time is selected
     * 
     * @param {number} counterId - The unique counter identifier
     * @returns {number | undefined} - The ticket number of the next customer to be served, or undefined if no clients are in queue
     * @throws {Error} - Throws an error if the counter is not configured with any services
     */
    public static callNextCustomer(counterId: number): number | undefined {
        const config = Configuration.instance;
        const services = config.counters.get(counterId);

        if (!services) {
            throw new Error(`Counter ${counterId} is not configured`);
        }

        let selectedQueue: Queue | undefined;
        for (const service of services) {
            const queue = config.queues.get(service);
            if (queue && (!selectedQueue || queue.length > selectedQueue.length || 
                (queue.length === selectedQueue.length && queue.service.expectedDuration < selectedQueue.service.expectedDuration))) {
                selectedQueue = queue;
            }
        }

        if (selectedQueue && selectedQueue.length > 0) {
            const nextTicket = selectedQueue.nextCustomer();
            return nextTicket;
        }

        return undefined;
    }
    
}