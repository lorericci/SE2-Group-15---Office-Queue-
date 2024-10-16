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
        if (!Database.instance.connected) return
        await Database.instance.client.end()
    }

    private static async checkConnection(): Promise<void> {
        if (Database.instance.connected) return
        Database.instance.connected = true
        await Database.instance.client.connect()
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

    public static async assignCounter(counterId: number, serviceNames: string[]): Promise<void> {
        await Database.checkConnection();

        const checkSql = `SELECT service_name FROM counter_service WHERE counter_id = $1 AND service_name = $2`;

        const insertSql = `INSERT INTO counter_service (counter_id, service_name, date) VALUES ($1, $2, NOW())`;

        for (const serviceName of serviceNames) {
            const result = await Database.instance.client.query(checkSql, [counterId, serviceName]);
            if (result.rows.length === 0) {
                await Database.instance.client.query(insertSql, [counterId, serviceName]);
            }
        }
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

    public static async getActiveServices(): Promise<any[]> {
        await Database.checkConnection();
        const sql = `
            SELECT DISTINCT service_name
            FROM counter_service
        `;
        const { rows } = await Database.instance.client.query(sql);
        const activeServices = rows.map(row => row.service_name)
        return activeServices;
    }

}