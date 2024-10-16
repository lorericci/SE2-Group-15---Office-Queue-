import { Button, Container, Spinner, Alert } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import API from '../../API/API.ts'; 

export function GetTicketComp() {
    const [services, setServices] = useState<string[]>([]);
    const [waiting, setWaiting] = useState<boolean>(false);
    const [ticketId, setTicketId] = useState<number | null>(null);
    const [serviceChoosen, setServiceChoosen] = useState<string | null>(null);
    const [showQR, setShowQR] = useState<boolean>(false);
    const [error, setError] = useState<string | null>('');

    useEffect(() => {
        const getServices = async () => {
            try {
                const services = await API.getActiveServices();
                setServices(services);
            } catch (err: any) {
                setError(err.message || 'An error occurred while getting the services');
            }
        };
        getServices();
    }, []);

    const handleGetTicket = async (service: string) => {
        try {
            setWaiting(true);
            setError('');  
            const res = await API.getTicket(service);  
            setTicketId(res); 
            setServiceChoosen(service);
            setWaiting(false);
            setShowQR(true);
        } catch (err: any) {
            setError(err.message || 'An error occurred while getting the ticket');
        }
    };

    const handleNewTicket = () => {
        setTicketId(null);
        setShowQR(false);
    }

    return (
        <>
            <Container fluid className="services-container m-0 p-0 d-flex flex-column justify-content-center align-items-center">
                {(!ticketId && !waiting) && <h1>Select a service</h1>}
                {(!ticketId && !waiting) &&
                    <div className="w-25 d-flex flex-wrap justify-content-between row-gap-3"> 
                        {services.map(service => (
                            <Button className='service-button'
                                key={service}
                                onClick={() => handleGetTicket(service)}
                            >
                                {service}
                            </Button>
                        ))}
                    </div>
                }
                {waiting && <h1>Getting ticket... <Spinner animation="border" /></h1>}
                
                {error && <Alert variant="danger">{error}</Alert>} 
                
                {ticketId && showQR && (
                    <div className='qr-container d-flex flex-column align-items-center gap-3'>
                        <h1 className='m-0'>Here it is your ticket!</h1>
                        <h3 className='m-0'>Service: {serviceChoosen}</h3>
                        <QRCode value={`Your queue number is:\n${ticketId}\n`} size={256} />
                        <div className="w-100 d-flex justify-content-between">
                            <Button variant='success' onClick={() => handleNewTicket()}> 
                                Get another ticket
                            </Button>
                            <Button variant='warning' onClick={() => setShowQR(false)}> 
                                Can't scan QR code
                            </Button>
                    </div>
                  </div>
                  )}
                {ticketId && !showQR && (
                    <div className='harcode-ticket-container d-flex flex-column align-items-center gap-2'>
                        <h1 className='m-0'>Ticket: #{ticketId}</h1>
                        <h3>Service: {serviceChoosen}</h3>
                        <Button variant='success' onClick={() => {handleNewTicket()}} className="mx-4"> 
                            Get another ticket
                        </Button>
                    </div>
                )}
            </Container>
            
        </>
    );
}
