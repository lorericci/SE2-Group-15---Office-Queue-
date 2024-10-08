

class Ticket {
    ticketId: number;
    estimatedTime: number;


    constructor(ticketId: number, estimatedTime: number) {
        this.ticketId = ticketId;
        this.estimatedTime = estimatedTime;
    }
}

export { Ticket}