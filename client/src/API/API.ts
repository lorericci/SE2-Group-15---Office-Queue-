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
            return data;
        } else {
            console.error('Error during the update');
            return false;
        }
    } catch (error) {
        console.error('Network error: ', error);
        return false;
    }

}

async function getActiveCounters() {
    try {
        const response = await fetch(baseURL + `/counters/active`, {
            method: 'GET'
        });

        const data = await response.json();
        if (response.ok) {
            return data.activeCounters;
        } else {
            console.error('Error during the update');
            return false;
        }
    } catch (error) {
        console.error('Network error: ', error);
        return false;
    }
}

/********   CALL CUSTOMER   *********/

async function getNumCounters() {
    try {
        const response = await fetch(baseURL + `/counters/count`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Error during the update');
            return false;
        }
    } catch (error) {
        console.error('Network error: ', error);
        return false;
    }
}

async function getQueues() {
    try {
        const response = await fetch(baseURL + `/queues/length`, {
            method: 'GET'
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Error getting queues');
            return false;
        }
    } catch (error) {
        console.error('Network error: ', error);
        return false;
    }
}

/********   SEE STATS   *********/
async function getStats(first_param: string, second_param: string, third_param: string) {
    try {
        const response = await fetch(baseURL + `stats/${first_param}/${second_param}/${third_param}`, {
            method: 'GET'
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Error getting stats');
            return false;
        }
    } catch (error) {
        console.error('Network error: ', error);
        return false;
    }
}

const API = {
    getTicket, nextCustomer, getActiveCounters, getServices, getActiveServices, getNumCounters, getQueues, getStats
}

export default API