import logo from './logo.svg';
import './App.css';
import Header from './Components/Layout/Header';
import Body from './Components/Layout/Body';
import Footer from './Components/Layout/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Body />
      <Footer />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
