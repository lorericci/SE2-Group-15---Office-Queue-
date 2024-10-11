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

const API = {
    getTicket
}

export default API