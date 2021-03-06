import React, { useState } from 'react';
import { Login } from '../Login';
import { Registration } from '../Registration';
import { Feed }  from '../Feed';
import '../../scss/mainPage.css';

export const MainPage = ({setUserName, tokenHandler, exit}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const modalHandler = () => {
    setModalOpen(!modalOpen);
  }

  let modalClassName;
  modalOpen  ? modalClassName = 'registration active' : modalClassName = 'registration';

	return (
      <div className="mainPage">
        <div className="container">
          <div className="content">
            <Feed/>
            <Login 
              setUserName={setUserName}
              exit={exit}
              tokenHandler={tokenHandler}
              modalHandler={modalHandler}/>
            {
              modalOpen 
              ? <Registration modalClassName={modalClassName} modalHandler={modalHandler}/>
              : null
            }
          </div>
        </div>
      </div>
	)       	
}