import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import API from "../../API/API";
import { useState } from "react";

function CounterMain() {

    const { id } = useParams();
    const [show, setShow] = useState(false);
    const [ticket_id, setTickeId] = useState('');
    const [service, setService] = useState('');

    async function handleNextCustomer(id: string | undefined) {
        if (id) {
            const numericId = parseInt(id, 10);
            if (!isNaN(numericId)) {
                const ticket_id = await API.nextCustomer(numericId);
                if (ticket_id) {
                    setTickeId(ticket_id);
                    setShow(true);
                }
            } else {
                console.log("ID not valid")
            }
        } else {
            console.error("ID not defined");
        }
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            {show && <h2>You will serve the customer with ticket id: {ticket_id} for service: { }</h2>}
            <Button onClick={() => { handleNextCustomer(id) }}>
                Next Customer
            </Button>
        </div>
    );
}

export default CounterMain