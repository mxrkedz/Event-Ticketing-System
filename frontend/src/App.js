import Header from './Components/Layout/Header';
import Home from './Components/Home';
import Footer from './Components/Layout/Footer';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} exact="true" />
        </Routes>
        <Footer />
      </Router>

    </div>
  );
}

export default App;
