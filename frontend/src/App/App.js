import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Context } from '../Context';
import { MainPage } from '../Components/pages/MainPage';
import { Navbar } from '../Components/Navbar';
import '../css/app.css';
export const App = () => {

  const [token, setToken] = useState('');
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem('token');
    const lsName = localStorage.getItem('userName');
    if (lsName !== 'undefined' && jwt !== 'undefined') {
      const jwtToken = JSON.parse(jwt);
      const name = JSON.parse(lsName);
      setToken(jwtToken);
      setUserName(name);
    } else {
      localStorage.removeItem('userName');
      localStorage.removeItem('token');
    }
  }, []);

  const tokenHandler = (jwtToken) => {
    setToken(jwtToken);
  }

  const exit = () => {
    localStorage.removeItem('token');
    setToken('');
    setUserName(null);
  }

  return (
    <Context.Provider value={{token, userName}}>
      <Router>
          <Navbar/>
              <Route exact path="/">
                <MainPage 
                  setUserName={setUserName}
                  tokenHandler={tokenHandler}
                  exit={exit}/>
              </Route>
              {/* <Route exact path="/profile">
                <Profile/>
              </Route>
              <Route exact path="/chat">
                <ChatPage/>
              </Route> */}
      </Router>
    </Context.Provider>
  )
}