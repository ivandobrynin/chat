const { Schema,  model } = require('mongoose');

const Message = new Schema({
  value: {type: String},
  author: {type: String},
  date: {type: String}
});

module.exports = model('Message', Message);