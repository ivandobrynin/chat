import React from 'react';
import '../css/mymessage.min.css';

export const MyMessage = ({msg, removeMessage}) => {
  return (
    <div className="myMessage">
      <div className="myMessage__header">
        <div className="myMessage__author">{msg.author}</div>
        <div className="myMessage__date">{msg.date}</div>
        <i  onClick={() => removeMessage(msg._id)} className="fas fa-trash"></i>
      </div>
      <div className="myMessage__divider"></div>
      <div className="myMessage__msg">{msg.value}</div>
    </div>
  )
}


