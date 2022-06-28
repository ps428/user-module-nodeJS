/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

// bcrypt to encrypt password
import bcrypt from 'bcryptjs';
// const bcrypt = require("bcrypt");

// importing jwt
import jwt from 'jsonwebtoken';

// env config
import dotenv from 'dotenv';
// const dotenv = require('dotenv');

/// importing the db functions from dbFunctions directory
import UserCrud from '../dbFunctions/userCrudFunctions.js'

export default class UserController {

  constructor() {
    // var userDBFunctions = new UserCrud;
    this.userDBFunctions = new UserCrud;
    // console.log("userDBFunctions initialized")
    // console.log(this.userDBFunctions)
    dotenv.config();
    this.dbName = process.env.DBNAME;
    this.saltValue = process.env.saltValue;
  }

  // ---------CREATE USER: DONE

  async createPassword() {
    const length = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  async createUser(req, res) {
    // console.log("create user called")
    // console.log("userDBFunctions called")
    // console.log(this);
    // console.log("==",this.userDBFunctions)
    const userid = req.body.userid;
    const mobile = req.body.mobile;
    const email = req.body.email;

    const duplicateCheck = await this.userDBFunctions.getUserDataByParameterDB(`(userid=? OR mobile=? OR email=?)`,[userid, mobile,email]);
    // console.log(duplicateCheck)
    if (duplicateCheck['success'] == true) {
      return res.status(409).json({ success: false, error: 'User already exists with these details: userid, mobile and email must be unique' });
    }

    // tokenize the password with bcrypt or JWT something, TODO
    // now we set user password to hashed password
    const salt = await bcrypt.genSalt(Number(this.saltValue));

    // Auto generation of passsword
    // eslint-disable-next-line quotes
    if (req.body.password == "") {
      req.body.password = await createPassword();
    }

    req.body.password = bcrypt.hashSync(req.body.password, salt);
    // console.log(req.body)
    // how to get username?
    // eslint-disable-next-line require-jsdoc
    try {
      const result = await this.userDBFunctions.addNewUserDB(req.body);
      // console.log("--",result)
      // retreving the sent data back from DB
      const user = await this.userDBFunctions.getUserDataByParameterDB(`(userid=?)`,[req.body.userid])

      res.json({ success: result.success && user.success, result: result, data: user });
    } catch (e) {
      res.status(400).json({ success: false, error: e });

      console.log(`Error in createUser function: ${e}`);
    }
  }


  // ---------UPDATE USER: DONE
  async updateUser(req, res) {
    const userid = req.params.id;

    const duplicateCheck = await this.userDBFunctions.getUserDataByParameterDB(`(userid=?)`,[userid]);
    // console.log("--,",duplicateCheck)
    if (duplicateCheck['success'] == false) {
      return res.status(404).json({ success: false, error: 'User does not exists' });
    }

    try {
      const oldValues = duplicateCheck.values[0];
      // console.log(oldValues);
      
      if (req.body.name)
        oldValues.name = req.body.name;

      if (req.body.mobile) {
        const mobileCheck = await this.userDBFunctions.getUserDataByParameterDB(`(mobile=? AND userid!=?)`,[req.body.mobile, userid])
        if (mobileCheck['success'] == true)
          return res.status(409).json({ success: false, error: 'Mobile number is already taken' });

        oldValues.mobile = req.body.mobile
      }

      if (req.body.email) {
        const emailCheck = await this.userDBFunctions.getUserDataByParameterDB(`(email=? AND userid!=?)`,[req.body.email, userid]);
        if (emailCheck['success'] == true)
          return res.status(409).json({ success: false, error: 'Email is already taken' });

        oldValues.email = req.body.email
      }

      if (req.body.picture) {
        oldValues.picture = req.body.picture
      }

      if (req.body.userTypeId) {
        oldValues.user_type_id = req.body.userTypeId
      }
      const jsTime = new Date();
      oldValues.updated_at = jsTime.toISOString().split('T')[0] + ' ' + jsTime.toTimeString().split(' ')[0];

      const result = await this.userDBFunctions.updateDataDB(oldValues,"users");
      // console.log(result)
      return res.json({ success: result.success, msg: result.msg });
    } catch (error) {
      console.warn('ERROR in updateUser function: ' + error);
      return res.status(400).json({success: false, msg:"FATAL ERROR! Contact Adminstrator"});
    }
  }


  // ---------DELETE USER: DONE
  async deleteUser(req, res) {
    const userid = req.params.id;
    // console.log(userid)

    // Check if user exists or not before deletion
    const duplicateCheck = await this.userDBFunctions.getUserDataByParameterDB(`userid=?`,[userid]);
    if (duplicateCheck['success'] == false) {
      return res.status(404).json({ success: false, error: 'User does not exists' });
    }
    try {
      const result = await this.userDBFunctions.deleteUserDB(userid, 1);
      // console.log(result)
      if (result.success == true) {
        res.json({ success: true, msg: `Successfully deleted the user.` });
      } else {
        res.json({ success: true, msg: `Unable to delete the user.` });
      }
    } catch (error) {
      console.log('ERROR in deleteUser function: ' + error);
      return res.status(400).json({success: false, msg:"FATAL ERROR! Contact Adminstrator"});
    }
  }


  // ---------CHANGE PASSWORD:
  async changePassword(req, res) {
    const userid = req.body.userid;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    try {
      // Check if user exists or not before updation
      const duplicateCheck = await this.userDBFunctions.getUserDataByParameterDB(`userid=?`,[userid]);
      // console.log(duplicateCheck)
      if (duplicateCheck['success'] == false) {
        return res.status(409).json({ success: false, error: 'User does not exists' });
      }

      let result = await this.userDBFunctions.passwordCheckDB(userid, password);
      if (!result['success']) {
        return res.status(401).json({ success: false, error: `Error! Wrong credentials` });
      }

      // Check if new password is same as old password
      if (password == newPassword) {
        return res.status(400).json({ success: false, error: `Old password and new password can not be same` });
      }

      result = await this.userDBFunctions.updatePasswordDB(userid, newPassword);
      // res.json(result)

      // -------------- JWT
      const data = {
        userID: userid,
      };
      const jwtSecretKey = process.env.JWT_SECRET_KEY;

      const token = jwt.sign(data, jwtSecretKey);
      res.header('auth-token', token);


      if (result.success)
        return res.json({ success: result.success, msg: `Changed password succesfully` });
      else
        return res.json({ success: result.success, msg: `Some error!`, data: result });

    } catch (error) {
      console.log('ERROR in changePassword function: ' + error);
      return res.status(400).json({success: false, msg:"FATAL ERROR! Contact Adminstrator"});
    }//   await client.close();
    // }
  }

}
