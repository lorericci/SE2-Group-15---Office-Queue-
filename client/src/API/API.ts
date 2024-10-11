//import { Ticket } from "../models/ticket";


const baseURL = "http://localhost:3000/ticket/"

/********   GET TICKET   *********/

async function getTicket(serviceName: string) {
    const response = await fetch(baseURL + `get-ticket/${serviceName}`)
    if (response.ok) {
        const ticket = await response.json()
        // const ticket = {ticketId: 3, estimatedTime: 10};
        return ticket;
    } else {
        const errDetail = await response.json();
        if (errDetail.error)
            throw errDetail.error
        if (errDetail.message)
            throw errDetail.message
        throw new Error("Error in getting ticket")
    }

}


async function nextCustomer(counterId: number) {
    try {
        const response = await fetch(baseURL + `next-cutomer`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ counterId: counterId }),
        });

        await response.json();
        if (response.ok) {
            return true;
        } else {
            console.error('Errore durante l\'aggiornamento:');
            return false;
        }
    } catch (error) {
        console.error('Errore di rete:', error);
        return false;
    }

}

const API = {
    getTicket, nextCustomer
}

export default API