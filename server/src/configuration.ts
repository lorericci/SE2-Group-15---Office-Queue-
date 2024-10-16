import { Queue } from "./queue";
import { Service } from "./service";
import { Database } from "./database";

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
        this.queues.set('Shipping', new Queue(new Service('Shipping', 12)))
        this.queues.set('Mail', new Queue(new Service('Mail', 5)))
        this.queues.set('Atm', new Queue(new Service('Stm', 7)))
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
    // CallCustomer
    public static async callCustomer(customerId: number): Promise<boolean> {
        const config = Configuration.instance;
        const queue = config.queues.get('customerService');
        
        if (!queue) {
            throw new Error(`Queue for customer service not configured`);
        }
    
        const callLogged = await Database.callCustomer(customerId);
        
        if (callLogged) {
            // Emit a WebSocket event to notify all clients about the called customer
            Configuration.io?.emit('customer_called', { customerId });
            queue.enqueue(customerId);
        }
    
        return callLogged;
    }
    
    // Add a static property for the WebSocket server
    private static io: SocketIO.Server | null = null;
    
    // Add a method to set the WebSocket server
    public static setSocketIO(io: SocketIO.Server) {
        Configuration.io = io;
    }