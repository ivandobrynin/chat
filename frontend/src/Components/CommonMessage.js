import React from 'react';
import '../css/commonMessage.min.css';

export const CommonMessage = ({msg}) => {
  return (
    <div className="commonMessage">
    <div className="commonMessage__header">
      <div className="commonMessage__author">{msg.author}</div>
      <div className="commonMessage__date">{msg.date}</div>
    </div>
    <div className="commonMessage__divider"></div>
    <div className="commonMessage__msg">{msg.value}</div>
  </div>
  )
}


