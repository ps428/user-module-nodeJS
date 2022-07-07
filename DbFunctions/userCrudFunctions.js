/* eslint-disable camelcase */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import DbOperation from 'db_pkg';
import PasswordHash from '../Common_functions/password_hash.js';
const dbOps = DbOperation;

export default class UserCrud {
  constructor() {
    this.userTable = process.env.USER_TABLE;
    this.saltValue = process.env.saltValue;
    this.passwordDealing = new PasswordHash();
  }

  async addNewUserDB(userData) {
    const name = userData['name'];
    const mobile = userData['mobile'];
    const email = userData['email'];
    const picture = userData.picture?userData.picture:null;
    const user_type_id = userData.userTypeId?userData.userTypeId:1;

    const userid = userData['userid'];
    const password = userData['password'];
    const fields = ['name', 'mobile', 'email', 'picture', 'userid', 'password', 'user_type_id', 'is_deleted'];
    const values = [[name, mobile, email, picture, userid, password, user_type_id, 0]];
    let result;

    try {
      const response = await dbOps.insertData('users', fields, values);
      result = {success: true, msg: 'Added user successfully'};
    } catch (e) {
      result = {success: false, error: e};

      console.log('Error in addNewUserDB function: ', e);
    }
    return result;
  }

  // A generic function to get data where we can pass in any criteria.
  async getUserDataByParameterDB(criteria, values = []) {
    const query = `SELECT * FROM users WHERE ${criteria} AND is_deleted=0;`;

    let result;
    result = {success: false, msg: 'blank'};
    try {
      const results = await dbOps.execCustomQuery(query, values);
      if (results.length == 0) {
        result = {success: false, msg: 'User data not found', values: results};
      } else {
        result = {success: true, msg: 'User data fetched successfully', values: results};
      }
    } catch (error) {
      console.log('Error in getUserDataByParameterDB function: ', error);
      result = {success: false, msg: error};
    }
    return result;
  }

  async updateDataDB(userData, _table) {
    const name = userData['name'];
    const mobile = userData['mobile'];
    const email = userData['email'];
    const picture = userData['picture'];
    const userTypeId = userData['userTypeId'];

    const jsTime = new Date();
    userData.updated_at = jsTime.toISOString().split('T')[0] + ' ' + jsTime.toTimeString().split(' ')[0];

    const updatedAt = userData['updatedAt'];

    delete userData.id;
    delete userData.username;
    delete userData.created_at;
    delete userData.password;
    delete userData.is_deleted;

    const data = userData;
    const conditions = {'userid': userData['userid']};

    let results;
    let result;

    try {
      results = await dbOps.updateData('users', data, conditions);
      result = {success: true, msg: 'Updated user successfully'};
    } catch (error) {
      console.log('Error in updareDataDB function: ', error);
      result = {success: false, msg: error};
    }
    return result;
  }

  // acccess will be included once the user roles are defined.
  // by default access=1 meaning that the user is admin and has all the previleges
  async deleteUserDB(userid, access = 1) {
    let result;
    if (access == 1) {
      const query = `UPDATE users SET is_deleted=? WHERE userid=?;`;
      const values = [1, userid];

      let results;
      let result;
      try {
        results = await dbOps.execCustomQuery(query, values);
        if (results.length == 0) {
          result = {success: false, msg: 'User data not found', values: results};
        } else {
          result = {success: true, msg: 'User deleted successfully', values: results};
        }
      } catch (error) {
        console.log('Error in getUserDataByParameterDB function: ', error);
        result = {success: false, msg: error};
      }
      return result;
    } else {
      // todo post user type definition
    }
    return result;
  }

  async passwordCheckDB(userid, password) {
    try {
      let result = {success: 0, data: 'Wrong credentials'};

      const query = `SELECT password from users WHERE userid=? AND is_deleted=0;`;

      try {
        const results = await dbOps.execCustomQuery(query, [userid]);
        result = {success: true, msg: results};
      } catch (e) {
        result = {success: false, msg: err};
        consosle.log(e);
      }

      const hashedPassword = result.msg[0].password;
      const doPasswordsMatch = this.passwordDealing.verifyPassword(password, hashedPassword);

      if (doPasswordsMatch) {
        result = {success: 1, data: doPasswordsMatch};
      } else {
        result = {success: 0, data: 'Wrong credentials!!'};
      }

      return result;
    } catch (e) {
      console.log('Error in passwordCheckDB function: ', e);
      const result = {success: false, data: e.message};
      return result;
    }
  }

  async updatePasswordDB(userid, newPassword) {
    const TokenizedPasswrod = this.passwordDealing.hashPassword(newPassword);
    // console.log(TokenizedPasswrod);
    let result = {success: 0, data: ''};

    const data = {'password': TokenizedPasswrod};
    const conditions = {'userid': userid};

    try {
      const results = await dbOps.updateData('users', data, conditions);
      result = {success: true, msg: results};
    } catch (e) {
      console.log('ERROR in updatePasswordDB function: ', e);
      result = {success: false, msg: e};
    }
    return result;
  }
}

