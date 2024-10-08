import { Queue } from "./queue";
import { Service } from "./service";

export class Configuration { // Implements the Singleton pattern
    private static _instance: Configuration | null = null;
    private queues: Map<string, Queue> // Map<service name, respective queue>
    private ticketId: number

    private constructor() {
        this.queues = new Map<string, Queue>()
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
}