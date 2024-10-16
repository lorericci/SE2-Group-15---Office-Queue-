POST /ticket - ask the server to issue a ticket for the requested service
    Request body: { serviceName: string }
    Response body: { ticketId: number, //TODO: expectedWaitingTime: number }
    Response status: OK, //TODO: specify others
    
GET /services - get all the services
    Response body: { services: string[] }
    Response status: OK, //TODO: others

GET /services/active - get all the services in the daily configuration that are assigned to at least one counter
    Response body: { services: string[] }
    Response status: OK, //TODO: others

POST /next-customer - call a customer to a counter. Update the display with the tickets being served accordingly.
    Request body: { counterId: number }
    Response body: { ticketId: number }
    Response status: OK, //TODO: others

POST /served - mark the ticket assigned to the current counter as served, update stats in the db
    Request body: { counterId: number }
    Response body: No
    Response status: OK, BAD_REQUEST = the counter wasn't previously assigned a ticket to serve calling POST /next

POST /service - configure a service
    Request body: { serviceName: string, estimatedTime: number (duration in seconds)}
    Response status: CREATED

POST /assign-counter - add a service to a counter if one service doesn't exist None is assigned
    Request body: { counterId: number, serviceNames: string[] }
    Response body: BAD_REQUEST, OK

GET /stats/(query parameter){daily, weekly, monthly}
    Response body: { stats: counterStats[] } where counterStats is an obj like
        {
            service1: 3,
            service7: 5
        }


------------------ USER STORY 3 -----------------------

GET /counters/count - return the total number of counters available
    Response body: { count: number}


webSocket
PORT NUMBER: 3001
Event name: call-customer
Data exchanged: { ticketId, counterId }

------------------ USER STORY 4 -----------------------

GET /stats/:first_param/:second_param/:third_param - return the stats filtered with the params

first_param could be: 'service' - 'counter'

second_param could be: 'daily' - 'weekly' - 'monthly'

third_param could be: 'date' if daily - '[1,2,3,4]/month/year' if weekly - '[1..12]/year