import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

function CounterMain(props: { NextCustomer: any; }) {

    const { id } = useParams();

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <Button onClick={() => { props.NextCustomer(id) }}>
                Next Customer
            </Button>
        </div>
    );
}

export default CounterMain