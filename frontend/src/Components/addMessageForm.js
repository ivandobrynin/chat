import React from 'react';
import '../css/addMessageForm.min.css';

export const AddMessageForm = ({ newMessageHandler, textareaHandler, value }) => {

  return (
    <div className="addMessageForm"> 
      <input 
        onChange={(e) => textareaHandler(e)}
        value={value}
        placeholder="Enter your message here">
      </input>
      <button
        onClick={(e) => newMessageHandler(e)}
        type="button" 
        className="btn btn-secondary">Add</button>
    </div>
  )
}


