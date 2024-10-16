import { Queue } from "./queue";
import { Service } from "./service";
import { Database } from "./database";
import { Server } from "socket.io";
import SocketIOConnection from "./socketio";

export class Configuration { // Implements the Singleton pattern
    private static _instance: Configuration | null = null;
    private queues: Map<string, Queue> // Map<service name, respective queue>
    private counters: Map<number, string[]>; // Map<counter id, list of service names>

    private constructor() {
        this.queues = new Map<string, Queue>()
        this.counters = new Map<number, string[]>()
        this.tmpHardcodeInit() //TODO: remove when implementing config counters
    }

    /**
     * The story config counters where services and counters will be configured will be implemented
     * in a future sprint. Therefore this function temporarely replaces that implementation.
     */
    private tmpHardcodeInit(): void {
        // TODO: remove service in queues beacuse it's redundant
        this.queues.set('Shipping', new Queue(new Service('Shipping', 12)))
        this.queues.set('Mail', new Queue(new Service('Mail', 5)))
        this.queues.set('Atm', new Queue(new Service('Atm', 7)))
        this.queues.set('Financial', new Queue(new Service('Financial', 20)))
        this.counters.set(1, ["Atm", "Financial"])
        this.counters.set(2, ["Atm"])
        this.counters.set(3, ["Shipping", "Mail", "Atm"])
        this.counters.set(4, ["Shipping"])
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
    public static async issueTicket(serviceName: string): Promise<number> {
        const queue: Queue | undefined = Configuration.instance.queues.get(serviceName)
        if (!queue) { throw new Error(`Queue for service ${serviceName} not configured`) }
        const ticketId = await Database.issueTicket(serviceName)
        queue.enqueue(ticketId)

        SocketIOConnection.emit('update-queue', {serviceName: serviceName, queueLength: this.getQueueLength(serviceName)})

        return ticketId
    }

    /**
     * Assign a list of services to a counter
     * @param {number} counterId - The unique counter identifier
     * @param {string[]} serviceNames - An array of service names that the counter can handle
     */
    public static async assignCounter(counterId: number, serviceNames: string[]) {
        const config = Configuration.instance;
        await Database.assignCounter(counterId, serviceNames);
        config.counters.set(counterId, serviceNames);
    }

    /**
     * Call the next customer to a specified counter
     * 
     * The next customer is selected from the longest queue among the services that the counter can handle
     * In case of queues of equal length, the service with the lowest service time is selected
     * 
     * @param {number} counterId - The unique counter identifier
     * @returns {{ nextTicket: number | undefined, service: Service | undefined }} - The ticket number of the next customer to be served and the selected service, or undefined if no clients are in queue
     * @throws {Error} - Throws an error if the counter is not configured with any services
     */
    public static callNextCustomer(counterId: number): { nextTicketId: number | undefined, service: Service | undefined } {
        if (typeof counterId !== 'number') //Typeguard
            throw new Error(`counterId must be a number but was ${typeof counterId}`)
        const config = Configuration.instance;
        const services: string[] | undefined = config.counters.get(counterId);

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

        let nextTicket: number | undefined
        if (selectedQueue && selectedQueue.length > 0) {
            nextTicket = selectedQueue.nextCustomer()
        }

        if(nextTicket)
            Database.serveTicket(nextTicket, counterId)

        const service = selectedQueue?.service;

        SocketIOConnection.emit('call-customer', { ticketId: nextTicket, counterId: counterId });
        SocketIOConnection.emit('update-queue', {serviceName: service?.name, queueLength: this.getQueueLength(service!.name)})

        return { nextTicketId: nextTicket, service: service };
    }

    public static getQueueLength(serviceName: string): number | undefined {
        const config = Configuration.instance;
        const queue = config.queues.get(serviceName);
    
        if (queue) {
            return queue.length;
        }
    
        return undefined;
    }

    public static getQueuesLength(): Map<string, number> {
        const config = Configuration.instance;
        const queuesLength: Map<string, number>  = new Map<string, number>();
        for (const [serviceName, queue] of config.queues) {
            queuesLength.set(serviceName, queue.length);
        }
        return queuesLength;
    }

}