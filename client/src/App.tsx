import { Route, Routes } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <Routes>
      <Route path='test1' element={'Test 1'}/>
      <Route path='test2' element={'Test 2'}/>
    </Routes>
  );
}

export default App;