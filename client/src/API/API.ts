//import { Ticket } from "../models/ticket";


const baseURL = "http://localhost:3000"

/********   GET TICKET   *********/

async function getTicket(serviceName: string) {
    const response = await fetch(baseURL + `/ticket/${serviceName}`, {
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ serviceName: serviceName }),
    })
    if (response.ok) {
        const ticketId: number = await response.json()
        // const ticket = {ticketId: 3, estimatedTime: 10};
        return ticketId;
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
        const response = await fetch(baseURL + `/next-cutomer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ counterId: counterId }),
        });

        const data = await response.json();
        if (response.ok) {
            return data.ticketId;
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