import React, { useState, useEffect, useRef } from 'react';
import '../../scss/chatPage.css';

export const ChatPage = () => {
  
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState([]);
  const socket = useRef();
  
  useEffect(() => {
    connect();
    return () => {
      socket.current.close();
    }
  }, []);

  function connect() {
    socket.current = new WebSocket('ws://localhost:5000/auth/chat');

    socket.current.onopen = () => {
      console.log('Chat Opened')
    }
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [message, ...prev]);
    }
    socket.current.onclose= () => {
      console.log('Chat closed');
    }
    socket.current.onerror = () => {
      console.log('Chat error');
    }
  }

  const newMessageHandler = async () => {
    socket.current.send(JSON.stringify({value}));
    console.log(messages);
    setValue('');
  }

  const goBackHandler = () => {
    window.history.back()
  }

  return (
     <div className="chat">
       <div className="container">
        <div
          onClick={goBackHandler}
          className="chat__back">
          <i className="fas fa-reply"></i>
        </div>
        <div className="chat__wrapper">
          <div className="chat__content">
            <div className="chat__messenger">
              <div className="chat__messenger-name">Chat Name</div>
              <div className="chat__messenger-window">
                <ul>
                  {messages.map(msg => {
                    return (
                      <li>
                        <div key={msg._id} className="chat__message">
                          {msg.value}
                        </div>
                      </li>
                      
                    )
                  })}
                </ul>

              </div>
              <div className="chat__messenger-input">
                <input
                  onChange={(e) => setValue(e.target.value)}
                  value={value}
                  type="text"
                  placeholder="Enter your message here...">
                  </input>
                  <button 
                    onClick={newMessageHandler}
                    className="btn btn-secondary">Enter</button>
              </div>
            </div>
            <div className="chat__users">
              <div className="chat__users-name">Users</div>
              <ul className="chat__users-list">
                <li className="chat__users-item">user 1</li>
                <li className="chat__users-item">user 2</li>
                <li className="chat__users-item">user 3</li>
                <li className="chat__users-item">user 4</li>
              </ul>
              <div className="chat__users-add">
                <i className="fas fa-user-plus"></i>
              </div>
              
            </div>
          </div>
          <div className="chat__sidebar">
            <div 
              onClick={connect}
              className="chat__addNew">
              <i className="fas fa-envelope-open-text"></i>
              <span>New Chat</span>
            </div>
            <div className="chat__block">
              <h4>Rooms</h4>
              <ul className="chat__list">
                <li className="chat__list-item">Первая</li>
                <li className="chat__list-item">Вторая</li>
                <li className="chat__list-item">Третья</li>
              </ul>
            </div>
          </div>
        </div>
       </div>
     </div>
  )
}