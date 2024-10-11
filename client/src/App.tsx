import { Route, Routes } from 'react-router-dom'
import './App.css'
import { GetTicketComp } from './components/customer-screen/getTicketComp.tsx'

function App() {

  return (
    <Routes>
      <Route path='get-ticket' element={<GetTicketComp />}/>
      <Route path='test2' element={'Test 2'}/>
    </Routes>
  );
}

export default App;