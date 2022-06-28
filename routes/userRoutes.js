/* eslint-disable max-len */
import express from 'express';
// Importing functionalities of the users from userController file
import UserController  from '../controllers/userController.js'
// Importing validators
import * as validator from '../validators/userValidationSchema.js';
// const validator = require('../validators/validation_schema')
import {validatorAction} from '../validators/validationAction.js';
// import {auth} from '../middlewares/auth.js';

// const express = require('express')
// eslint-disable-next-line new-cap
const userRouter = express.Router();

// console.log("controller start");
let userContObj = new UserController();
// console.log("controller end");

// const user = require('../controllers/userController')

// const validatorAction = require('../validators/validation_action')

// Setting the requests
userRouter.post('/', validator.createUserValidation, validatorAction, userContObj.createUser.bind(userContObj));
userRouter.put('/:id', validator.updateUserValidation, validatorAction, userContObj.updateUser.bind(userContObj));
userRouter.post('/changepassword', validator.changePasswordValidation, validatorAction, userContObj.changePassword.bind(userContObj));
userRouter.delete('/:id', validator.deleteValidation, validatorAction, userContObj.deleteUser.bind(userContObj));

// // for testing
// userRouter.get('/userData/:id', auth, user.getUserData);

export {userRouter};
