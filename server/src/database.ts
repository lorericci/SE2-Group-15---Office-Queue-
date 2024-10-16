import { Pool } from 'pg'

export class Database {
    private static _instance: Database | null = null
    private connected: boolean
    private pool: Pool

    private constructor() {
        const connectionString = process.env.DB_CONNECTION_STRING
        if (!connectionString) throw new Error(`Couldn't load DB_CONNECTION_STRING environment variable`)
        this.pool = new Pool({connectionString})
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
        await Database.instance.pool.end()
    }

    private static async checkConnection(): Promise<void> {
        if (Database.instance.connected) return
        Database.instance.connected = true
        await Database.instance.pool.connect()
    }

    /**
     * @returns the id of the issued ticket
     */
    public static async issueTicket(serviceName: string): Promise<number> {
        await Database.checkConnection()
        const sql = "INSERT INTO ticket (service_name) VALUES ($1) returning id;"
        const { rows } = await Database.instance.pool.query(sql, [serviceName])
        const ticketId = rows.pop().id as number
        return ticketId
    }

    public static async serveTicket(ticketId: number, counterId: number) {
        await Database.checkConnection();
        const updateSql = "UPDATE ticket SET counter_id = $1, served_at = NOW() WHERE id = $2";
        await Database.instance.pool.query(updateSql, [counterId, ticketId]);
    }

    public static async assignCounter(counterId: number, serviceNames: string[]): Promise<void> {
        await Database.checkConnection();

        const checkSql = `SELECT service_name FROM counter_service WHERE counter_id = $1 AND service_name = $2`;

        const insertSql = `INSERT INTO counter_service (counter_id, service_name, date) VALUES ($1, $2, NOW())`;

        for (const serviceName of serviceNames) {
            const result = await Database.instance.pool.query(checkSql, [counterId, serviceName]);
            if (result.rows.length === 0) {
                await Database.instance.pool.query(insertSql, [counterId, serviceName]);
            }
        }
    }

    public static async getActiveCounters(): Promise<Number[]> {
        await Database.checkConnection();
        const selectSql = `SELECT DISTINCT counter_id FROM counter_service`;
        const { rows } = await Database.instance.pool.query(selectSql);
        const activeCounters = rows.map(row => row.counter_id);
        return activeCounters;
    }

    public static async getServices(): Promise<any[]> {
        await Database.checkConnection()
        const sql = "SELECT * FROM service"
        const { rows } = await Database.instance.pool.query(sql)
        return rows
    }

    public static async getActiveServices(): Promise<any[]> {
        await Database.checkConnection();
        const sql = `
            SELECT DISTINCT service_name
            FROM counter_service
        `;
        const { rows } = await Database.instance.pool.query(sql);
        const activeServices = rows.map(row => row.service_name)
        return activeServices;
    }

    public static async getNumCounters(): Promise<number> {
        await Database.checkConnection();
        const sql = `SELECT COUNT(*) FROM counter`;
        const { rows } = await Database.instance.pool.query(sql);
        const count = rows[0].count;
        return count;
    }

}