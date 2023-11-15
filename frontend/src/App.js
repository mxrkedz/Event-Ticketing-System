import Header from './Components/Layout/Header';
import Home from './Components/Layout/Home';
import Footer from './Components/Layout/Footer';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventsList from "./Components/Admin/EventsList";
import Dashboard from "./Components/Admin/Dashboard";


function App() {
  return (
    <div className="App">
      <Header/>
      <Home/>
      <Footer/>
      <Router/>

    </div>
  );
}

export default App;
