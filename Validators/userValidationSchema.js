/* eslint-disable max-len */
import {check} from 'express-validator';
// const {check} = require('express-validator')

const createUserValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('mobile', 'Mobile number required').isLength({min: 10, max: 15}),//make configurable
  check('email', 'Please enter a valid email id').isEmail().normalizeEmail({gmail_remove_dots: true}),
  // check('picture', 'Please enter a link to your photo').isURL(),
  // no validation needed for user type? not sure...
  check('userid', 'Please enter a unique userid').not().isEmpty(),
  check('password', 'Enter password of atleast 6 characters').isLength({min: 6}),//make configurable
];

const updateUserValidation = [
//   check('Name', 'Name is required').not().isEmpty(),
//   check('Address.Add1', 'Add1 is required').not().isEmpty(),
//   check('Address.Add2', 'Add2 is required').not().isEmpty(),
//   check('Address.Add3', 'Add3 is required').not().isEmpty(),
//   check('Address.Area', 'Area is required').not().isEmpty(),
//   check('Address.City', 'City is required').not().isEmpty(),
//   check('Address.State', 'State is required').not().isEmpty(),
//   check('Address.Country', 'Country is required').not().isEmpty(),
//   check('Address.Pincode', 'A correct numeric Pincode is required').not().isEmpty().isLength({min: 6}).isInt(),
//   check('ContactDetails.Mobile', 'Mobile number required of 10 digits').isLength({min: 10, max: 10}).isInt(),
//   check('ContactDetails.Email', 'Please enter a valid email id').isEmail().normalizeEmail({gmail_remove_dots: true}),
//   check('Picture', 'Please enter a link to your photo').isURL(),
  // no validation needed for user type? not sure...
];


const logInValidation = [
  check('userid', 'Please enter a unique user id').not().isEmpty(),
  check('password', 'Enter password of atleast 6 characters').isLength({min: 6}),//make configurable
];


const changePasswordValidation = [
  check('userid', 'Please enter a unique user id').not().isEmpty(),
  // check('oldPassword', 'Enter password of atleast 6 characters').isLength({min: 6}),
  // check('newPassword', 'Enter password of atleast 6 characters').isLength({min: 6}),
];

const deleteValidation = [
  // check('userid', 'Please enter a unique user id').not().isEmpty(),
];

export {createUserValidation, updateUserValidation, logInValidation, deleteValidation, changePasswordValidation};
