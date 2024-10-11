import { Button, Container, Spinner, Alert } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import API from '../../API/API.ts'; 


export function GetTicketComp() {
    const [phase, setPhase] = useState<number>(0);
    const [services, setServices] = useState<string[]>([]);
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
            setPhase(1); 
            setError('');  
            const res = await API.getTicket(service);  
                setTicketId(res); 
                setPhase(2); 
        } catch (err: any) {
            setPhase(0);
            setError(err.message || 'An error occurred while getting the ticket');
        }
    };

    return (
        <>
            <Container className="d-flex flex-column justify-content-start align-items-center" style={{ height: '100vh', paddingTop: '20px' }}>
                <h1>Select a service</h1>
                <div className="d-flex justify-content-center mb-4"> 
                    {services.map(service => (
                        <Button
                            key={service}
                            variant="primary"
                            style={{ margin: '0 10px' }}
                            onClick={() => handleGetTicket(service)}
                            disabled={phase !== 0}
                        >
                            {service}
                        </Button>
                    ))}
                </div>
                {error && <Alert variant="danger">{error}</Alert>} 
                
                {phase === 1 && <h1>Getting ticket... <Spinner animation="border" /></h1>}
                {phase === 2 && ticketId && !showQR && (
                    <div className="text-center mt-4">
                        <h1>Here it is your ticket!</h1>
                        <QRCode value={`Your queue number is:\n${ticketId}\n`} size={256} />
                        <div className="d-flex justify-content-center mt-3">
                            <Button variant='success' onClick={() => setPhase(0)} className="mx-4"> 
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
                        <Button variant='success' onClick={() => {setPhase(0); setShowQR(false);}} className="mx-4"> 
                            Get another ticket
                        </Button>
                    </div>
                )}
            </Container>
            
        </>
    );
}
