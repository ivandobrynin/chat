const Router = require('express');
const router = new Router();
const controller = require('./authController');
const { check } = require('express-validator');

router.post('/registration', [
  check("username", "Username cannot be empty").notEmpty(),
  check("password", "Password cannot be shorter than 4 characters").isLength({min: 4, max: 16})
], controller.registration);
router.post('/finduser', controller.findUser);
router.post('/login', controller.login);
router.post('/message', controller.createComment);
router.get('/users', controller.getUsers);
router.get('/feed', controller.getMessages);
router.post('/removeMessage', controller.removeMessage);

module.exports = router;