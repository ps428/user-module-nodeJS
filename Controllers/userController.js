/* eslint-disable require-jsdoc */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

// env config
import dotenv from 'dotenv';

// / importing the db functions from dbFunctions directory
import UserCrud from '../DbFunctions/userCrudFunctions.js';
import PasswordHash from '../Common_functions/password_hash.js';

export default class UserController {
  constructor() {
    this.passwordDealing = new PasswordHash();
    this.userDBFunctions = new UserCrud;
    dotenv.config();
    this.dbName = process.env.DBNAME;
    this.saltValue = process.env.saltValue;
  }

  async createUser(req, res) {
    const userid = req.body.userid;
    const mobile = req.body.mobile;
    const email = req.body.email;

    const duplicateCheck = await this.userDBFunctions.getUserDataByParameterDB(`(userid=? OR mobile=? OR email=?)`, [userid, mobile, email]);
    if (duplicateCheck['success'] == true) {
      return res.status(409).json({success: false, error: 'User already exists with these details: userid, mobile and email must be unique'});
    }

    // Auto generation of passsword if password is left blank
    if (req.body.password == '') {
      req.body.password = await this.passwordDealing.createPassword();
    }

    // Hashing password
    req.body.password = this.passwordDealing.hashPassword(req.body.password);
    try {
      const result = await this.userDBFunctions.addNewUserDB(req.body);
      const user = await this.userDBFunctions.getUserDataByParameterDB(`(userid=?)`, [req.body.userid]);

      res.json({success: result.success && user.success, result: result, data: user});
    } catch (e) {
      res.status(400).json({success: false, error: e});
      console.log(`Error in createUser function: ${e}`);
    }
  }

  async updateUser(req, res) {
    const userid = req.params.id;

    const duplicateCheck = await this.userDBFunctions.getUserDataByParameterDB(`(userid=?)`, [userid]);

    if (duplicateCheck['success'] == false) {
      return res.status(404).json({success: false, error: 'User does not exists'});
    }

    try {
      const oldValues = duplicateCheck.values[0];

      if (req.body.name) {
        oldValues.name = req.body.name;
      }

      if (req.body.mobile) {
        const mobileCheck = await this.userDBFunctions.getUserDataByParameterDB(`(mobile=? AND userid!=?)`, [req.body.mobile, userid]);
        if (mobileCheck['success'] == true) {
          return res.status(409).json({success: false, error: 'Mobile number is already taken'});
        }

        oldValues.mobile = req.body.mobile;
      }

      if (req.body.email) {
        const emailCheck = await this.userDBFunctions.getUserDataByParameterDB(`(email=? AND userid!=?)`, [req.body.email, userid]);
        if (emailCheck['success'] == true) {
          return res.status(409).json({success: false, error: 'Email is already taken'});
        }

        oldValues.email = req.body.email;
      }

      if (req.body.picture) {
        oldValues.picture = req.body.picture;
      }

      if (req.body.userTypeId) {
        oldValues.user_type_id = req.body.userTypeId;
      }

      const result = await this.userDBFunctions.updateDataDB(oldValues, 'users');
      return res.json({success: result.success, msg: result.msg});
    } catch (error) {
      console.warn('ERROR in updateUser function: ' + error);
      return res.status(400).json({success: false, msg: 'FATAL ERROR! Contact Adminstrator'});
    }
  }

  async deleteUser(req, res) {
    const userid = req.params.id;

    // Check if user exists or not before deletion
    const duplicateCheck = await this.userDBFunctions.getUserDataByParameterDB(`userid=?`, [userid]);
    if (duplicateCheck['success'] == false) {
      return res.status(404).json({success: false, error: 'User does not exists'});
    }
    try {
      const result = await this.userDBFunctions.deleteUserDB(userid, 1);
      if (result.success == true) {
        res.json({success: true, msg: `Successfully deleted the user.`});
      } else {
        res.json({success: true, msg: `Unable to delete the user.`});
      }
    } catch (error) {
      console.log('ERROR in deleteUser function: ' + error);
      return res.status(400).json({success: false, msg: 'FATAL ERROR! Contact Adminstrator'});
    }
  }

  async changePassword(req, res) {
    const userid = req.body.userid;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    try {
      // Check if user exists or not before updation
      const duplicateCheck = await this.userDBFunctions.getUserDataByParameterDB(`userid=?`, [userid]);

      if (duplicateCheck['success'] == false) {
        return res.status(409).json({success: false, error: 'User does not exists'});
      }

      let result = await this.userDBFunctions.passwordCheckDB(userid, password);
      if (!result['success']) {
        return res.status(401).json({success: false, error: `Error! Wrong credentials`});
      }

      // Check if new password is same as old password
      if (password == newPassword) {
        return res.status(400).json({success: false, error: `Old password and new password can not be same`});
      }

      result = await this.userDBFunctions.updatePasswordDB(userid, newPassword);

      if (result.success) {
        return res.json({success: result.success, msg: `Changed password succesfully`});
      } else {
        return res.json({success: result.success, msg: `Some error!`, data: result});
      }
    } catch (error) {
      console.log('ERROR in changePassword function: ' + error);
      return res.status(400).json({success: false, msg: 'FATAL ERROR! Contact Adminstrator'});
    }
  }
}
