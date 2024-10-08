import { Button, Container } from 'react-bootstrap';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import API from '../../API/API.ts';
import { Ticket } from '../../models/ticket.ts';

export function GetTicketComp() {

    const [phase, setPhase] = useState(0);
    const [ticket, setTicket] = useState<Ticket | null>(null);

    const handleGetTicket = async (service: string) => {
        try {
          setPhase(1);
          const res: Ticket = await API.getTicket(service);
          setTicket(res);
          setPhase(2);
        }catch(err) {
          setPhase(0);
          postMessage({msg: err, type: 'danger'});
        }
      };


      return (
        <>
          <Container
      className="d-flex flex-column justify-content-start align-items-center" 
      style={{ height: '100vh', paddingTop: '20px' }}
    >
      <h1>Select a service</h1>
      <div className="d-flex justify-content-center">
        <Button variant="primary" style={{ margin: '0 10px' }} onClick={()=>handleGetTicket("Service 1")}>
          Service 1
        </Button>
        <Button variant="primary" style={{ margin: '0 10px' }} onClick={()=>handleGetTicket("Service 2")}>
          Service 2
        </Button>
        <Button variant="primary" style={{ margin: '0 10px' }} onClick={()=>handleGetTicket("Service 3")}>
          Service 3
        </Button>
        <Button variant="primary" style={{ margin: '0 10px' }} onClick={()=>handleGetTicket("Service 4")}>
          Service 4
        </Button>
      </div>
    </Container>
        {phase === 1 && <h1>Getting ticket...</h1>}
        {phase === 2 && <h1>Ticket received!
                            <QRCode value={ticket} />  {/* to fix */}
                        </h1>}

    </>
    );
}

