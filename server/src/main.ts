import express from "express"

const PORT: number = 3000; //TODO: move to .env file
const app = express();

app.listen(PORT, () => {
    console.log(`[server]: Server is running solid and fast at http://localhost:${PORT}`);
});