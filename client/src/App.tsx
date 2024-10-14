import { Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import API from './API/API.ts';
import { GetTicketComp } from './components/customer-screen/getTicketComp.tsx';
import { useEffect, useState } from 'react';
import { Alert, Row } from 'react-bootstrap';
import NavHeader from './components/navHeader/NavHeader.tsx';
import CounterMain from './components/counter-interface/counterMain.tsx';
import Display from './components/main-display/displayMain.tsx';

interface Message {
  msg: string;
  type: 'success' | 'danger';
}

function App() {
  const [message, setMessage] = useState<Message | string>('');

  useEffect(() => {
    if (message) {
      console.log("Message updated:", message);
    }
  }, [message]);

  async function NextCustomer(id: number) {
    console.log("Calling API for next customer...");
    const ticket_id = await API.nextCustomer(id);
    console.log("Ticket ID returned:", ticket_id);

    if (ticket_id) {
      setMessage({ msg: "Stiamo servendo il ticket: " + ticket_id, type: 'success' });
    } else {
      setMessage({ msg: "Errore nel generare il prossimo ticket da servire", type: 'danger' });
    }
  }


  return (
    <Routes>
      <Route path="/" element={
        <>
          <NavHeader />
          <div>
            {typeof message === 'object' && message !== null && (
              <Row>
                <Alert className="text-center" variant={message.type} onClose={() => setMessage('')} dismissible>
                  {message.msg}
                </Alert>
              </Row>
            )}
            <Outlet />
          </div>
        </>
      }>

        <Route path="counters/:id" element={<CounterMain NextCustomer={NextCustomer} />} />
        <Route path="get-ticket" element={<GetTicketComp />} />
        <Route path="display" element={<Display />} />
      </Route>
    </Routes>
  );
}

export default App;
