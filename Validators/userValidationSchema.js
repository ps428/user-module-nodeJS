/* eslint-disable max-len */
import {check} from 'express-validator';

const createUserValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('mobile', 'Mobile number required').isLength({min: 10, max: 15}),                               //make configurable
  check('email', 'Please enter a valid email id').isEmail().normalizeEmail({gmail_remove_dots: true}),
  // check('picture', 'Please enter a link to your photo').isURL(),
  // no validation needed for user type? not sure...
  check('userid', 'Please enter a unique userid').not().isEmpty(),
  check('password', 'Enter password of atleast 6 characters').isLength({min: 6}),                       //make configurable
];

const updateUserValidation = [

];


const logInValidation = [
  check('userid', 'Please enter a unique user id').not().isEmpty(),
  check('password', 'Enter password of atleast 6 characters').isLength({min: 6}),//make configurable
];


const changePasswordValidation = [
  check('userid', 'Please enter a unique user id').not().isEmpty(),
];

const deleteValidation = [
  
];

export {createUserValidation, updateUserValidation, logInValidation, deleteValidation, changePasswordValidation};
