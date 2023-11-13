
import './App.css';
import Header from './Components/Layout/Header';
import Body from './Components/Layout/Body';
import Footer from './Components/Layout/Footer';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventsList from "./Components/Admin/EventsList";
import Dashboard from "./Components/Admin/Dashboard";


function App() {
  return (
    <div className="App">
      <Body/>
      <Router>
      <Header />
        <Routes>
          <Route path="/admin/events" element={<EventsList />} />
          <Route path="/dashboard" element={<Dashboard />} />
        
          
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
