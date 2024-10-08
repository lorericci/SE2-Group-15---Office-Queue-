import express from "express"
import { Configuration } from "./configuration";
import { StatusCodes } from "http-status-codes"

const PORT: number = 3000; //TODO: move to .env file
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