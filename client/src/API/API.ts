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
        const ticketId: { ticketId: number } = await response.json();
         // const ticket = {ticketId: 3, estimatedTime: 10};
        return ticketId.ticketId;
    } else {
        const errDetail = await response.json();
        if (errDetail.error)
            throw errDetail.error
        if (errDetail.message)
            throw errDetail.message
        throw new Error("Error in getting ticket")
    }

}


async function getServices() {
    const response = await fetch(baseURL + `/service/all`);
    if (response.ok) {
        const services: { services: string[] } = await response.json();
        return services.services;
    } else {
        const errDetail = await response.json();
        if (errDetail.error)
            throw errDetail.error
        if (errDetail.message)
            throw errDetail.message
        throw new Error("Error in getting services")
    }
}


/********   NEXT CUSTOMER   *********/

async function nextCustomer(counterId: number) {
    try {
        const response = await fetch(baseURL + `/next-customer`, {
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
            console.error('Error during the update');
            return false;
        }
    } catch (error) {
        console.error('Network error: ', error);
        return false;
    }

}

const API = {
    getTicket, nextCustomer, getServices
}

export default API