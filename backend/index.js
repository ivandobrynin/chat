const express = require('express');
const cors = require('cors');
const ws = require('ws');
const mongoose = require('mongoose');
const app = express();
const server = require('http').createServer(app);
const authRouter = require('./authRoutes');
const Message = require('./models/Message');
const PORT = 5000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use('/auth', authRouter);

const wss = new ws.Server({server: server});

wss.on('connection', function connection(ws) {
  ws.on('message', function (message, id) {
    message = JSON.parse(message);
    createComment(message, ws.id);
  });
});

async function createComment (message, id) {
  try {
    const {value, author, date} = message;
    const newMessage = new Message({value, author, date});
    await newMessage.save();
    wss.clients.forEach(client => {
      if (client.id === id) {
        client.send(JSON.stringify(newMessage));
      }
    });
  } catch (e) {
      console.log(e);
      res.json({message: 'Something goes wrong'});
  }
}

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://druggruzovik:123qaz321QAZ@cluster0.yulqa.mongodb.net/auth?retryWrites=true&w=majority')
        server.listen(PORT, () => console.log(`Server started on ${PORT} port`));
    } catch (e) {
        console.log(e);
    }
}

start();