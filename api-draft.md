POST /ticket - ask the server to issue a ticket for the requested service
    Request body: { serviceName: string }
    Response body: { ticketId: number, expectedWaitingTime: number }
    Response status: OK, //TODO: specify others
    
GET /service/all - get all the services in the daily configuration
    Response body: { services: string[] }
    Response status: OK, //TODO: others

//TODO: rename counters to desks
POST /next-customer - call a customer to a desk. Update the display with the tickets being served accordingly.
    Request body: { deskId: number }
    Response body: { ticketId: number }
    Response status: OK, //TODO: others

POST /served - mark the ticket assigned to the current desk as served, update stats in the db
    Request body: { deskId: number }
    Response body: No
    Response status: OK, BAD_REQUEST = the desk wasn't previously assigned a ticket to serve calling POST /next

POST /service - configure a service
    Request body: { serviceName: string, estimatedTime: number (duration in seconds)}
    Response status: CREATED

//TODO: rename counter to desk, what if only some of the services exists? Is a partial assignment made?
POST /assign-counter - add a service to a desk
    Request body: { deskId: number, serviceNames: string[] }
    Response body: BAD_REQUEST, OK

GET /stats/{daily, weekly, monthly}
    Response body: { stats: counterStats[] } where counterStats is an obj like
        {
            service1: 3,
            service7: 5
        }

Updating the display of the current ticketId for each counter 
requires a webSocket because the connection is initiated by the server.