import React, { useState, useContext } from 'react';
import { Context } from '../Context';
import '../css/login.min.css';

export const Login = ({ tokenHandler, modalHandler, exit, setUserName }) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const {token, userName} = useContext(Context);

  const auth = async () => {
    const errorSpans = document.querySelectorAll('.login__errors span');
    const url = 'http://localhost:5000/auth/login';
		let res = await fetch(url, {
			method: "POST",
			body: JSON.stringify({
        username: login,
        password: password
      }),
			headers: {
        'Content-Type': 'application/json'
      }
		});
    const result = await res.json();

    if (res.ok) {
      localStorage.setItem('token', JSON.stringify(result.token));
      localStorage.setItem('userName', JSON.stringify(result.userName));
      setUserName(result.userName);
      tokenHandler(result.token);
    } else {
      errorSpans[0].textContent = result.message;
    }
    setLogin('');
    setPassword('');
  }

  const loginHandler = (e) => {
    const errorSpans = document.querySelectorAll('.login__errors span');
    errorSpans.forEach(span => {
      span.textContent = '';
    });
    const value = e.target.value;
    setLogin(value);
  }
  const passwordHandler = (e) => {
    const errorSpans = document.querySelectorAll('.login__errors span');
    errorSpans.forEach(span => {
      span.textContent = '';
    });
    const value = e.target.value;
    setPassword(value);
  }

  const keyPressHandler = (e) => {
    if (e.key === 'Enter') {
      auth();
    }
  }

  if (token) {
    return (
      <div className="login-auth">
        <div className="login-auth__header">
          <div className="login-auth__header-name">{userName}</div>
        </div>
        <div 
          className="login-auth__header-exit"
          onClick={exit}>
          <i className="fas fa-door-open"></i>
          <span>Exit</span>
        </div>
      </div>
    )
  }

  return (
    <div className="login" onKeyPress={(e) => keyPressHandler(e)}>
      <div className="login__header">
        <div>Sigh in or</div>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={modalHandler}
          >Sign up</button>
      </div>
      <div className="login__content">
        <input
          type="text"
          onChange={(e) => loginHandler(e)}
          value={login}
          className="login__input" 
          placeholder="Login"></input>
        <input 
          type="password"
          onChange={(e) => passwordHandler(e)}
          value={password}
          className="login__input" 
          placeholder="Password"></input>
          <button
            onClick={auth}
            type="button" 
            className="btn btn-success">Sign in</button>
      </div>
      <div className="login__errors">
        <span></span>
      </div>
    </div>
  )
}