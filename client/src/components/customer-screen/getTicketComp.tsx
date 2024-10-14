import { Button, Container, Spinner, Alert } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import API from '../../API/API.ts'; 
import Service from '../../models/service.ts';

export function GetTicketComp() {
    const [services, setServices] = useState<Service[]>([]);
    const [waiting, setWaiting] = useState<boolean>(false);
    const [ticketId, setTicketId] = useState<number | null>(null);
    const [showQR, setShowQR] = useState<boolean>(false);
    const [error, setError] = useState<string | null>('');

    useEffect(() => {
        const getServices = async () => {
            try {
                const services = await API.getServices();
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
            setWaiting(false);
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
                {!waiting && <h1>Select a service</h1>}
                {!waiting &&
                    <div className="w-25 d-flex flex-wrap justify-content-between row-gap-3"> 
                        {services.map(service => (
                            <Button className='service-button'
                                key={service.name}
                                onClick={() => handleGetTicket(service.name)}
                            >
                                {service.name}
                            </Button>
                        ))}
                    </div>
                }
                {waiting && <h1>Getting ticket... <Spinner animation="border" /></h1>}
                
                {error && <Alert variant="danger">{error}</Alert>} 
                
                {ticketId && !showQR && (
                    <div className="text-center mt-4">
                        <h1>Here it is your ticket!</h1>
                        <QRCode value={`Your queue number is:\n${ticketId}\n`} size={256} />
                        <div className="d-flex justify-content-center mt-3">
                            <Button variant='success' className="mx-4"> 
                                Get another ticket
                            </Button>
                            <Button variant='warning' onClick={() => setShowQR(true)} className="mx-2"> 
                                Can't scan QR code
                            </Button>
                    </div>
                  </div>
                  )}
                {showQR && (
                    <div className="text-center mt-4">
                        <h3>Ticket #{ticketId}</h3>
                        <Button variant='success' onClick={() => {handleNewTicket();}} className="mx-4"> 
                            Get another ticket
                        </Button>
                    </div>
                )}
            </Container>
            
        </>
    );
}
