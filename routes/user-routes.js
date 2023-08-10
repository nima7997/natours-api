const express = require('express');
const userController = require('../controllers/user-controller');
const authController = require('../controllers/authController');
const router = require('./review-routes');

const Router = express.Router();

Router.post('/signup', authController.signup);
Router.post('/login', authController.login);

Router.post('/forgotPassword', authController.forgotPassword);
Router.patch('/resetPassword/:token', authController.resetPassword);
Router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

Router.use(authController.protect);

Router.get('/me', userController.getMe, userController.getUser);
Router.patch('/updateMe', userController.updateMe);
Router.delete('/deleteMe', userController.deleteMe);

Router.use(authController.restrictTo('admin'));

Router.route('/')
  .get(userController.getAllusers)
  .post(userController.createUser);

Router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = Router;
