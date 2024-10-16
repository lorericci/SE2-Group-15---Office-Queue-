import { useEffect, useState } from 'react';
import { socket } from './socket.tsx';
import API from '../../API/API.ts';
import './displayMain.css';
import { Button } from 'react-bootstrap';

const Display = () => {
  const [ticketInfo, setTicketInfo] = useState<{ [key: number]: number }>([123, 22, 23, 25]);
  const [lastCounter, setLastCounter] = useState(0);
  const [numCounters, setNumCounters] = useState(0);

  useEffect(() => {

    const getNumCounters = async () => {
        // Call API to get the number of counters
        const count = await API.getNumCounters();
        setNumCounters(count);
        //console.log("Stampa" + count);
        //setNumCounters(6);
    };
    getNumCounters();
  },[]);

  useEffect(() => {
    // Listen event 'next_ticket' from server
    socket.on('call-customer', ({ ticketId, counterId }) => {
        setTicketInfo((prevInfo) => ({
            ...prevInfo,
            [counterId-1]: ticketId,
          }));
          setLastCounter(counterId);
    });

    // Cleanup event listener
    return () => {
      socket.off('call-customer');
    };
  }, []);

  useEffect(() => {
    if (lastCounter !== null) {
      // Reproduce sound every time lastCounter changes
      const audio = new Audio('./sound.mp3');
      audio.play().catch(error => console.log('Playback failed:', error));
    }
  }, [lastCounter]);

  return (
    <>
    <div className="display-container">
      {[...Array(numCounters)].map((_, counterId) => (
        <div key={counterId} className="counter-box">
          <h2>Counter {counterId + 1}</h2>
          <h3>Ticket: {ticketInfo[counterId] || '---'}</h3>
        </div>
      ))}
    </div>
    <div className="customer-info">
      <h3>Last call</h3>
      <h4>Ticket #{ticketInfo[lastCounter-1] || '---'}</h4>
      <h4>requested at Counter {lastCounter || '---'}</h4>
    </div>
    </>
  );
};

export default Display;