import React, { useState } from 'react';
import '../css/registration.min.css';

export const Registration = ({modalClassName, modalHandler}) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [secondErrorMessage, setSecondErrorMessage] = useState('');

  const loginHandler = (e) => {
    setErrorMessage('');
    setSecondErrorMessage('');
    const value = e.target.value;
    setLogin(value);
  }
  const passwordHandler = (e) => {
    setErrorMessage('');
    setSecondErrorMessage('');
    const value = e.target.value;
    setPassword(value);
  }

  const registration = async () => {
    const message = document.querySelector('.registration__message');
    const errorSpans = document.querySelectorAll('.registration__errors span');
    const url = 'http://localhost:5000/auth/registration';
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

    let result = await res.json();

    if(res.ok) {
      errorSpans.forEach(span => span.textContent = '');
      message.textContent = result.message;
      setLogin('');
      setPassword('');
      setTimeout(() => {
        modalHandler();
      }, 1500);
    } else {
      if (result.errors) {
        const errors = result.errors;
        if (errors.length > 1 ) {
          setErrorMessage(errors[0].msg);
          setSecondErrorMessage(errors[1].msg);
        } else {
          setErrorMessage(errors[0].msg);
        }
      } else {
        setErrorMessage(result.message);
        setSecondErrorMessage('');
      }
    }
  }

  const onPressHandler = (e) => {
    if (e.key === 'Enter') {
      registration();
    }
  }
  return (
    <div 
      onKeyPress={(e) => onPressHandler(e)}
      className={modalClassName}>
      <div className="registration__content">
      <button
        onClick={modalHandler}
        className="registration__close">&#10006;</button>
      <div className="registration__title">Registration</div>
        <input
          type="text"
          value={login}
          onChange={(e) => loginHandler(e)}
          className="registration__input"
          placeholder="Username"></input>
        <input
          type="text"
          value={password}
          onChange={(e) => passwordHandler(e)}
          className="registration__input"
          placeholder="Password"></input>
          <button
            onClick={registration}
            type="button" 
            className="btn btn-success">Sign up</button>
          <div className="registration__notification">
            <div className="registration__message"></div>
            <div className="registration__errors">
              <span>{errorMessage}</span>
              <span>{secondErrorMessage}</span>
            </div>
          </div>
      </div>
    </div>
  )
}