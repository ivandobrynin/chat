const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcrypt');
const Message = require('./models/Message');
const jwt = require('jsonwebtoken');
const { secret } = require('./config');
const { validationResult } = require('express-validator');

const generateAccessToken = (id, roles) => {
  const payload = {id, roles};
  return jwt.sign(payload, secret, {expiresIn: '24h'})
}


class AuthController {
  async registration (req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({message: 'Registration failed', ...errors});
      }
      const { username, password } = req.body;
      const candidate = await User.findOne({username});
      if (candidate) {
        return res.status(400).json({message: 'User already exists'});
      }
      
      const userRole = await Role.findOne({value: "USER"});
      const saltRounds = 6;
      const hashPassword = await bcrypt.hash(password, saltRounds);
      const user = new User({username, password: hashPassword, roles: [userRole.value]});
      await user.save();
      res.json({message: 'User was successfully registered'});
    } catch (e) {
      console.log(e);
      res.status(400).json({message: 'Registration error'});
    }
  }

  async login (req, res) {
    try {
      const {username, password} = req.body;
      const user = await User.findOne({username})
      if (!user) {
        return res.status(400).json({message: `User ${username} not found`});
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({message: `Wrong password`});
      }
      const token = generateAccessToken(user._id, user.roles);
      // const decodedData = jwt.verify(token, secret);
      const userName = user.username;
      const id = user._id;
      return res.json({message: `Welcome ${userName}`, token, userName, id});
    } catch (e)      {
      console.log(e);
      res.status(400).json({message: 'Login error'});
    }
  }

  async getUsers (req, res) {
    try {
      const allUsers = await User.find();
      return await res.json(allUsers);
    } catch (e) {
      console.log(e);
      res.status(400).json({message: 'Get users error'});
    }
  }

  async getMessages (req, res) {
    try {
      const allMessages = await Message.find();
      const messages = allMessages.reverse();
      return await res.json({messages});
    } catch (e) {
      console.log(e);
      res.status(400).json({message: 'Get users error'});
    }
  }

  async createComment (req, res) {
      try {
        const { value } = req.body;
        const newMessage = new Message({value});
        await newMessage.save();
        res.json({message: 'Comment was successfully added'});
      } catch (e) {
        console.log(e);
        res.json({message: 'Something goes wrong'});
      }
  }

  async removeMessage (req, res) {
    try {
      const { id, value, date, author } = req.body;
      const message = await Message.findOne({value, date, author});
      await message.remove();
      const messages = await Message.find();
      res.json({message: 'Message was successfully removed', messages: messages});
    } catch (e) {
      console.log(e);
      res.json({message: 'Something goes wrong'});
    }
}
  
  async findUser (req, res) {
    const { username } = req.body;
    const user = await User.findOne({username});
    if (!user) {
      return res.status(400).json({message: `User ${username} not found`});
    }
    return res.json({message: `User ${username} was found`});
  }
}

module.exports = new AuthController();