import { Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import API from './API/API.ts';
import { GetTicketComp } from './components/customer-screen/getTicketComp.tsx';
import { useEffect, useState } from 'react';
import NavHeader from './components/navHeader/NavHeader.tsx';
import CounterMain from './components/counter-interface/CounterMain.tsx';
import Display from './components/main-display/displayMain.tsx';
import NotFound from './components/notFound/NotFound.tsx';
import ManagerMain from './components/manager-interface/ManagerMain.tsx';

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


  return (
    <Routes>
      <Route path="/" element={
        <>
          <NavHeader />
          <div>
            <Outlet />
          </div>
        </>
      }>

        <Route path="counters/:id" element={<CounterMain />} />
        <Route path="get-ticket" element={<GetTicketComp />} />
        <Route path="display" element={<Display />} />
        <Route path="manager" element={<ManagerMain />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
