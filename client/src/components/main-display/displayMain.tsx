import { useEffect, useState } from 'react';
import { socket } from './socket.tsx';
import API from '../../API/API.ts';
import './displayMain.css';

const Display = () => {
  const [ticketInfo, setTicketInfo] = useState<{ [key: number]: number }>([]);
  const [lastCounter, setLastCounter] = useState(0);
  const [numCounters, setNumCounters] = useState(0);
  const [activeServices, setActiveServices] = useState<string[]>([]);
  // const [services, setServices] = useState<Map<string, number>>(new Map<string, number>());

  const [queues, setQueues] = useState<Map<string, number>>(new Map<string, number>());

  useEffect(() => {
    const getNumCounters = async () => {
      try{
        // Call API to get the number of counters
        const count = await API.getNumCounters();
        setNumCounters(count);
        //setNumCounters(6);
      } catch (error) {
        console.error('Error during the update: ' + error);
      }    
    };
    getNumCounters();
  }, []);

  useEffect(() => {
    // Listen event 'next_ticket' from server
    socket.on('call-customer', ({ ticketId, counterId }) => {
      setTicketInfo((prevInfo) => ({
        ...prevInfo,
        [counterId - 1]: ticketId,
      }));
      setLastCounter(counterId);
    });

    // Cleanup event listener
    return () => {
      socket.off('call-customer');
    };
  }, []);



  useEffect(() => {
    socket.on('update-queue', ({ serviceName, queueLength }) => {
        setQueues(new Map(queues.set(serviceName, queueLength)));
    });

    return () => {
      socket.off('update-queue');
    };
  }, []);

  useEffect(() => {
    const getActiveServices = async () => {
      try {
        const activeServices = await API.getActiveServices();
        const queuesLength = await API.getQueues();

        console.log(queuesLength);
        console.log(activeServices);

        setActiveServices(activeServices);

        // activeServices.forEach((s) => {
        //   queues.set(s, queuesLength[s]) 
        // });
        const queuesMap: Map<string, number> = new Map<string, number>(Object.entries(queuesLength).map(([key, value]) => [key, value as number]));
        setQueues(queuesMap);
      } catch (error) {
        console.error('Error during the update: ' + error);
      }  
    }
    getActiveServices();
  }, []);

  // useEffect(() => {
  //   if (lastCounter !== null) {
  //     // Reproduce sound every time lastCounter changes
  //     const audio = new Audio('./sound.mp3');
  //     audio.play().catch(error => console.log('Playback failed:', error));
  //   }
  // }, [lastCounter]);

  return (
    <>
    {console.log(queues)}
      <div className="services-container">
      
        { activeServices.map((service, index) => (
          <div key={index} className="service-box">
            <h2>{service}</h2>
            <h3>Waiting: {queues.get(service)}</h3>
            
          </div>
          
          ))}
      </div>

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
        <h4>Ticket #{ticketInfo[lastCounter - 1] || '---'}</h4>
        <h4>requested at Counter {lastCounter || '---'}</h4>
      </div>
    </>
  );
};

export default Display;