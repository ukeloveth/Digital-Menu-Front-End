import './App.css';
import MenuView from './MenuView';
import AdminView from './AdminView'
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  
  return (
    <BrowserRouter>
      <div className="App">
      <Routes>
        <Route path="/" element={<MenuView />} />
        <Route path='/admin' element={<AdminView/>} />
      </Routes>
    
      </div>
    </BrowserRouter>
  );
}

export default App;
