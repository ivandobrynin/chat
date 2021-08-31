import React from 'react';
import '../css/companionMessage.min.css';

export const CompanionMessage = ({msg}) => {
  return (
    <div className="companionMessage">
      <div className="companionMessage__header">
        <div className="companionMessage__author">{msg.author}</div>
        <div className="companionMessage__date">{msg.date}</div>
      </div>
      <div className="companionMessage__divider"></div>
      <div className="companionMessage__msg">{msg.value}</div>
    </div>
  )
}


