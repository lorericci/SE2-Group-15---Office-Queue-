import { Client } from 'pg'

/**
 * Singleton wrapping database utilities. A single connection persists and is closed if tryCloseClient() is called
 * The connection is opened lazily when a public method calls the .instance getter
 */
export class Database {
    private static _instance: Database | null = null
    private client: Client

    private constructor() {
        const connectionString = process.env.DB_CONNECTION_STRING
        if (!connectionString) throw new Error(`Couldn't load DB_CONNECTION_STRING environment variable`)
        this.client = new Client(connectionString)
        this.client.connect()
        console.log("Connected to the db")
    }

    private static get instance(): Database {
        if (!Database._instance) {
            Database._instance = new Database()
        } return Database._instance
    }

    public static async tryCloseClient() {
        if (!Database._instance) return
        await Database.instance.client.end()
    }
}