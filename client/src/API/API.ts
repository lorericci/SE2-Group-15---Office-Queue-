//import { Ticket } from "../models/ticket";

import Service from "../models/service";


const baseURL = "http://localhost:3000"

/********   GET TICKET   *********/

async function getTicket(serviceName: string) {
    const response = await fetch(baseURL + `/ticket`, {
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


async function getServices(): Promise<Service[]> {
    const response = await fetch(baseURL + `/services`);
    if (response.ok) {
        const services = await response.json();
        return services;
    } else {
        const errDetail = await response.json();
        if (errDetail.error)
            throw errDetail.error
        if (errDetail.message)
            throw errDetail.message
        throw new Error("Error in getting services")
    }
}


async function getActiveServices(): Promise<string[]> {
    const response = await fetch(baseURL + `/services/active`);
    if (response.ok) {
        const activeServices = await response.json();
        return activeServices;
    } else {
        const errDetail = await response.json();
        if (errDetail.error)
            throw errDetail.error;
        if (errDetail.message)
            throw errDetail.message;
        throw new Error("Error in getting active services");
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


async function getNumCounters() {
    try {
        const response = await fetch(baseURL + `/counters/count`);
        const data = await response.json();
        if (response.ok) {
            return data.count;
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
    getTicket, nextCustomer, getServices, getActiveServices, getNumCounters
}

export default API