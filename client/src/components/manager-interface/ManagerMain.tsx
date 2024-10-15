import { useEffect, useState } from "react";
import { Button, ButtonGroup, Dropdown, DropdownButton, ToggleButton } from "react-bootstrap";
import API from "../../API/API";
import "./ManagerMain.css";

function ManagerMain() {

    const [loggedIn, setLoggedIn] = useState(true);


    return (<>
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            {!loggedIn && <LogInForm />}
            {loggedIn && <StatsMenu />}
            
        </div></>
        
    );
}


function LogInForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div>
            <h2>Manager Login</h2>
            <form>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <Button type="submit">Log In</Button>
            </form>
        </div>
    );
}


function StatsMenu() {

    
    const [services, setServices] = useState<string[]>(["Service 1", "Service 2", "Service 3"]);
    const [serviceValue, setServiceValue] = useState(0);
    const [timeValue, setTimeValue] = useState(0);

    const times = ["Daily", "Weekly", "Monthly"];

    // useEffect(() => {
    //     const getActiveServices = async () => {
    //     const res = await API.getActiveServices();
    //     setServices(res);
    //     console.log(res);
    //     }
    //     getActiveServices();
    // }, []);

    return (
        <div>
            <h2>Manager Interface</h2>
            <h3>Statistics</h3>

            <ButtonGroup>
                {times.map((time, idx) => (
                    <ToggleButton
                        key={idx}
                        id={`time-${idx}`}
                        type="radio"
                        name="time"
                        value={time}
                        checked={timeValue === idx}
                        onClick={() => setTimeValue(idx)}
                        style={{
                            backgroundColor: timeValue === idx ? '#28a745' : 'transparent',
                            borderColor: '#28a745',
                            color: timeValue === idx ? 'white' : '#28a745',
                            outline: 'none',
                            boxShadow: 'none',
                        }}
                    >
                        {time}
                    </ToggleButton>
                ))}
            </ButtonGroup>
                {" "}
            <ButtonGroup>
                {services.map((service, idx) => (
                    <ToggleButton
                        key={idx}
                        id={`radio-${idx}`}
                        type="checkbox"
                        name="service"
                        value={service}
                        checked={serviceValue === idx}
                        onClick={() => setServiceValue(idx)}
                        style={{
                            backgroundColor: serviceValue === idx ? '#28a745' : 'transparent',
                            borderColor: '#28a745',
                            color: serviceValue === idx ? 'white' : '#28a745',
                            outline: 'none',
                            boxShadow: 'none',
                        }}
                    >
                        {service}
                    </ToggleButton>
                ))}
            </ButtonGroup>
        </div>
    );
}


export default ManagerMain