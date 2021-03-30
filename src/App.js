import React, { useState } from 'react';
import './App.scss'

import {
  BrowserRouter as Router
} from "react-router-dom";

import Routes from './router/Routes'
import Footer from './common/Footer'
import Header from './common/Header'


function App() {

  const [token, setToken] = useState(null);

  const refreshToken = (token) => {
    setToken(token);
  }

  const getToken = () => {
    return token;
  }
  
  return (
    <div className="App">
      <Router>
        <div>
          <Header />
          <Routes token={token} setToken={refreshToken} getToken={getToken}/>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
