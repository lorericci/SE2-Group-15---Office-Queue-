import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import API from "../../API/API";
import { useEffect, useState } from "react";

function CounterMain() {
    const { id } = useParams();
    const [config, setConfig] = useState(false);
    const [show, setShow] = useState(false);
    const [ticket_id, setTickeId] = useState('');
    const [service, setService] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        setConfig(true); // da eliminare questa riga e mettere il resto quando emanuele finisce la controparte backend API
        /*
        const counterConfig = async () => {
            if (id) {
                const numericId = parseInt(id, 10);
                if (!isNaN(numericId)) {
                    try {
                        const response = await API.getIfCounterConfig(numericId);
                        if (response) {
                            setConfig(true);
                        } else {
                            setConfig(false);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    console.error("Invalid counter ID");
                }
            } else {
                console.error("Counter ID is undefined");
            }
        }
        counterConfig();
        */
    }, [id]);

    async function handleNextCustomer(id: string | undefined) {
        if (id) {
            const numericId = parseInt(id, 10);
            if (!isNaN(numericId)) {
                const nextCustomer = await API.nextCustomer(numericId);
                if (nextCustomer.message) {
                    setShow(false);
                    setMessage('No Clients in queue');
                } else {
                    setTickeId(nextCustomer.ticketId);
                    setService(nextCustomer.service.name);
                    setShow(true);
                    setMessage('');
                }
            } else {
                console.log("ID not valid")
            }
        } else {
            console.error("ID not defined");
        }
    }

    return (
        <>
            {config ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}>
                    {show && (
                        <div style={{ marginBottom: '20px' }}>
                            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                                You will serve the customer
                            </h2>
                            <span style={{ fontSize: '32px', fontWeight: 'bold' }}>
                                Ticket: {ticket_id} | Service: {service}
                            </span>
                        </div>
                    )}
                    {message && (
                        <h2 style={{ marginBottom: '20px' }}>
                            {message}
                        </h2>
                    )}
                    <Button onClick={() => { handleNextCustomer(id) }}>
                        Next Customer
                    </Button>
                </div>
            ) : (
                <h2 style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}>Counter not configured</h2>
            )}
        </>
    );
}

export default CounterMain;
