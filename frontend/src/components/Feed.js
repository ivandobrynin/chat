import React, { useState, useEffect, useRef, useContext } from 'react';
import img from '../img/loading.gif';
import { Context } from '../Context';
import { AddMessageForm } from '../components/addMessageForm';
import { MyMessage } from '../components/MyMessage';
import { CompanionMessage } from '../components/CompanionMessage';
import { CommonMessage } from '../components/CommonMessage';
import '../css/feed.min.css';

export const Feed = () => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const {token} = useContext(Context);
  const socket = useRef();

  useEffect(() => {
    getMessages();
    connect();
    return () => {
      socket.current.close();
    }
  }, []);

  useEffect(() => {
    const list = document.getElementById('feed__list');
    if (list) {
      list.scrollTop = 99999;
    }
  }, [messages]);
  
  async function getMessages () {
    let res = await fetch('http://localhost:5000/auth/feed');
    let result = await res.json();
    if (res.ok) {
      setIsloading(false);
      const msgArr = result.messages.reverse();
      setMessages(msgArr);
    }
  }

  function connect() {
    socket.current = new WebSocket('ws://localhost:5000/auth/feed');
    socket.current.onopen = () => {
      console.log('Socket Opened')
    }
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    }
    socket.current.onclose= () => {
      console.log('Socket closed');
    }
    socket.current.onerror = () => {
      console.log('Socket error');
    }
  }

  const textareaHandler = (e) => {
    const text = e.target.value;
    setValue(text);
  }
  
  const newMessageHandler = async () => {
    const userName = localStorage.getItem('userName');
    const currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();

    const checkDate = (num) => {
      return num < 10 ? '0'+ num : num;
    }

    year = year.toString().slice(2);
    month = checkDate(month);
    day = checkDate(day);
    hours = checkDate(hours);
    minutes = checkDate(minutes);

    const date = `${day}-${month}-${year}  ${hours}:${minutes}`;
    const message = {
      value: value,
      author: JSON.parse(userName),
      date: date
    }
    socket.current.send(JSON.stringify(message));
    setValue('');
  }

  const keyPressHandler = (e) => {
    if (e.key === 'Enter') {
      newMessageHandler();
    }
  }

  const removeMessage = async (id) => {
    const message = messages.find(msg => msg._id === id);
    const url = 'http://localhost:5000/auth/removeMessage';
		let res = await fetch(url, {
			method: "POST",
			body: JSON.stringify({
        id: message._id,
        value: message.value,
        date: message.date,
        author: message.author
      }),
			headers: {
        'Content-Type': 'application/json'
      }
		});
    const result = await res.json();
    if (res.ok) {
      setMessages(result.messages)
    }
  }
  
  return (
    <div className="feed" onKeyPress={(e) => keyPressHandler(e)}>
      <div className="feed__header">
        <span>Comments</span>
      </div>
      {
        isLoading 
        ?
          <img
          className="loading"
            src={img} 
            alt="png">
          </img>
        :      
        <> 
        <ul className="feed__list" id="feed__list">
          {messages?.map(msg => {
            if (!token) {
              return (
                <CommonMessage key={msg._id} msg={msg} />
              )
            }
            if (msg.author === JSON.parse(localStorage.getItem('userName'))) {
              return (
                <MyMessage key={msg._id} msg={msg} removeMessage={removeMessage}/>
              )
            } else {
              return (
                <CompanionMessage key={msg._id} msg={msg}/>
              )
            }
          })}
        </ul>
          {
            token ?
              <AddMessageForm 
                newMessageHandler={newMessageHandler}
                textareaHandler={textareaHandler}
                value={value}/>
              : null
          }
        </>
      }
    </div>
  )
}