/* eslint-disable max-len */
import express from 'express';
// Importing functionalities of the users from userController file
import UserController  from '../Controllers/userController.js'
// Importing validators
import * as validator from '../Validators/userValidationSchema.js';
// const validator = require('../validators/validation_schema')
import {validatorAction} from '../Validators/validationAction.js';
// import {auth} from '../middlewares/auth.js';

// eslint-disable-next-line new-cap
const userRouter = express.Router();

let userContObj = new UserController();


// Setting the requests
userRouter.post('/', validator.createUserValidation, validatorAction, userContObj.createUser.bind(userContObj));
userRouter.put('/:id', validator.updateUserValidation, validatorAction, userContObj.updateUser.bind(userContObj));
userRouter.post('/changepassword', validator.changePasswordValidation, validatorAction, userContObj.changePassword.bind(userContObj));
userRouter.delete('/:id', validator.deleteValidation, validatorAction, userContObj.deleteUser.bind(userContObj));


export {userRouter};
