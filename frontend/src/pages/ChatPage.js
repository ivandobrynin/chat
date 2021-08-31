import React, { useState, useEffect, useRef } from 'react';
import '../scss/chatPage.css';

export const ChatPage = () => {
  
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [visibleChat, setVisibleChat] = useState(false);
  const socket = useRef();

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers () {
    let res = await fetch('http://localhost:5000/auth/users');
    let result = await res.json();
    if (res.ok) {
      setUsers(result);
    }
  }
  
  function connect() {
    socket.current = new WebSocket('ws://localhost:5000/auth/chat');
    console.log(socket.current);
    socket.current.onopen = () => {
      console.log('Chat Opened');
    }
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
      setMessages(prev => [...prev, message]);
    }
    socket.current.onclose= () => {
      console.log('Chat closed');
    }
    socket.current.onerror = () => {
      console.log('Chat error');
    }
  }


  const openChatWindow = async (id) => {
    console.log(id);
    setVisibleChat(true);
    connect(id);
  }

  const newMessageHandler = async () => {
    socket.current.send(JSON.stringify({value}));
    setValue('');
  }

  const keyPressHandler = (e) => {
    if (e.key === 'Enter') {
      newMessageHandler();
    }
  }

  const goBackHandler = () => {
    window.history.back()
  }

  const addUser = async () => {
    const username = prompt('Введите имя пользователя');
    if (username) {
      const url = 'http://localhost:5000/auth/finduser';
      let res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          username
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      let result = await res.json();
      if (!res.ok) {
        alert(`${result.message}`);
      } else {
        connect(username);
      }
    }
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
          <div className="chat__content" onKeyPress={(e) => keyPressHandler(e)}>
            {
              visibleChat
              ? 
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
              : 
              null
            }
            
            <div className="chat__users">
              <div className="chat__users-name">Users</div>
              <ul className="chat__users-list">
                {users.map(user => {
                  return (
                    <li
                      onClick={() => openChatWindow(user._id)}
                      key={user._id} 
                      className="chat__users-item">
                      {user.username}
                    </li>
                  )
                })}
              </ul>
              <div 
                className="chat__users-add">
                <i className="fas fa-user-plus"></i>
              </div>
            </div>
          </div>

          
          
          <div className="chat__sidebar">
            <div 
              onClick={addUser}
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