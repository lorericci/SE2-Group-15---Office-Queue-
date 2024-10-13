import { Client } from 'pg'

export class Database {
    private static _instance: Database | null = null
    private connected: boolean
    private client: Client

    private constructor() {
        const connectionString = process.env.DB_CONNECTION_STRING
        if (!connectionString) throw new Error(`Couldn't load DB_CONNECTION_STRING environment variable`)
        this.client = new Client(connectionString)
        this.connected = false
    }

    private static get instance(): Database {
        if (!Database._instance) {
            Database._instance = new Database()
        } return Database._instance
    }

    public static async tryCloseClient(): Promise<void> {
        if (!Database._instance) return
        await Database.instance.client.end()
    }

    private static async checkConnection(): Promise<void> {
        if (Database.instance.connected) return
        await Database.instance.client.connect()
        Database.instance.connected = true
    }

    /**
     * @returns the id of the issued ticket
     */
    public static async issueTicket(serviceName: string): Promise<number> {
        await Database.checkConnection()
        const sql = "INSERT INTO ticket (service_name) VALUES ($1) returning id;"
        const { rows } = await Database.instance.client.query(sql, [serviceName])
        const ticketId = rows.pop().id as number
        return ticketId
    }
    // callcustomer
    public static async CallCustomer(customerId: number): Promise<boolean> {
    await Database.checkConnection();
    const sql = "INSERT INTO call_log (customer_id, call_time) VALUES ($1, NOW()) returning id;";
    const { rows } = await Database.instance.client.query(sql, [customerId]);
    const callLogId = rows.pop()?.id as number;

    // If callLogId exists, the call log was successfully inserted
    return callLogId !== undefined;
}

    public static async getServices(): Promise<any[]> {
        await Database.checkConnection()
        const sql = "SELECT * FROM service"
        const { rows } = await Database.instance.client.query(sql)
        return rows
    }  
}