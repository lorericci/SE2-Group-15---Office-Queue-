import express from "express"
import { Configuration } from "./configuration";
import { StatusCodes } from "http-status-codes"
import dotenv from 'dotenv'

dotenv.config()

const PORT: number = parseInt(process.env.EXPRESS_PORT || '3000', 10)
const app = express();

app.use(express.json())

app.post('/ticket', function (request, response) {
    const { serviceName }: { serviceName: string } = request.body;
    const ticketId: number = Configuration.issueTicket(serviceName)
    response.status(StatusCodes.OK).send({ ticketId: ticketId })
});

app.listen(PORT, () => {
    console.log(`[server]: Server is running solid and fast at http://localhost:${PORT}`);
});