import { Button, Container } from 'react-bootstrap';
import { useState } from 'react';

export function GetTicketComp() {

    const [phase, setPhase] = useState(0);

    // const handleGetTicket = async (service: number) => {
    //     try {
    //       setPhase(1);
    //       const ticket = await API.getTicket(service);
    //       setPhase(2);
    //     }catch(err) {
    //       setPhase(0);
    //       postMessage({msg: err, type: 'danger'});
    //     }
    //   };


    return (<>
        <Container
            className="d-flex justify-content-center align-items-start" 
            style={{ height: '100vh', paddingTop: '20px' }}
        >
             <div>
                    <Button variant="primary" style={{ marginBottom: '20px' }} /*onClick={() => handleGetTicket(1)}*/>Service 1</Button>{' '}
                    <Button variant="primary" style={{ marginBottom: '20px' }} /*onClick={() => handleGetTicket(2)}*/>Service 2</Button>{' '}
                    <Button variant="primary" style={{ marginBottom: '20px' }} /*onClick={() => handleGetTicket(3)}*/>Service 3</Button>{' '}
                    <Button variant="primary" style={{ marginBottom: '20px' }} /*onClick={() => handleGetTicket(4)}*/>Service 4</Button>{' '}
                </div>
        </Container>
        {phase === 1 && <h1>Getting ticket...</h1>}
        {phase === 2 && <h1>Ticket received!</h1>}
    </>
    );
}
