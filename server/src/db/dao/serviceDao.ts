import sql from '../db.js';

export default class ServiceDAO {
    async insertService(name: string, avg_time: number): Promise<{ name: string, average_time: number } | null> {
        try {
            const [result] = await sql`
                insert into services
                    (name, average_time)
                values
                    (${name}, ${avg_time})
                returning name, average_time
            `;

            return result ? { name: result.name, average_time: result.average_time } : null;
        } catch (error) {
            console.error('Error inserting service:', error);
            return null;
        }
    }
}
