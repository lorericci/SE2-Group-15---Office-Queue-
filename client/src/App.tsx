import { Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import { GetTicketComp } from './components/customer-screen/getTicketComp.tsx';
import NavHeader from './components/navHeader/NavHeader.tsx';
import CounterMain from './components/counter-interface/CounterMain.tsx';
import Display from './components/main-display/displayMain.tsx';
import NotFound from './components/notFound/NotFound.tsx';
import ManagerMain from './components/manager-interface/ManagerMain.tsx';

function App() {

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
