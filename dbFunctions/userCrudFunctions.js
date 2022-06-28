/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { connection } from '../dbConfig.js';
import bcrypt from 'bcryptjs';
import DbOperation from "db_pkg";
const dbOps = DbOperation;

export default class UserCrud {
  constructor() {
    this.userTable = process.env.USER_TABLE;
    this.saltValue = process.env.saltValue;
  }

  async addNewUserDB(userData) {
    // console.log(userData)
    // console.log(userData.picture?userData.picture:null)
    const name = userData['name']
    const mobile = userData['mobile']
    const email = userData['email']
    const picture = userData.picture?userData.picture:null

    const userid = userData['userid']
    const password = userData['password']
    // const jsTime = new Date();
    // const created_at = jsTime.toISOString().split('T')[0] + ' ' + jsTime.toTimeString().split(' ')[0];

    const user_type_id = userData.userTypeId?userData.userTypeId:1

    const fields = ['name', 'mobile', 'email', 'picture', 'userid', 'password', 'user_type_id', 'is_deleted']
    const values = [[name, mobile, email, picture, userid, password, user_type_id, 0]]
    let result;
    try {
      const response = await dbOps.insertData("users", fields, values);
      result = { success: true, msg: "Added user successfully" }

    }
    catch (e) {
      result = { success: false, error: e }
      
      console.log("Error in addNewUserDB function: ", e)
    }
    return result;

    // console.log(userTypeId);
    // const query = `INSERT INTO ${this.userTable} (name, mobile, email, picture, user_type_id, userid, password, created_at, is_deleted) VALUES (?,?,?,?,?,?,?,?,0);`

    // let result;
    // try {
    //   const response = await new Promise((resolve, reject) => {
    //     connection.query(query, [name, mobile, email, picture, userTypeId, userid, password, createdAt], (err, results) => {
    //       if (err) {
    //         result = { success: false, msg: err }
    //         reject(err.message)
    //       }
    //       else {
    //         resolve(results);
    //         result = { success: true, msg: "Added user successfully" }
    //       }
    //     })
    //   })
    // } catch (error) {
    //   console.log("Error in addNewUserDB function: ", error)
    //   result = { success: false, msg: error }
    // }
    // return result
  }

  // parameterType as in userid and paramaterName as in pranavs, there can be other combinations as well
  // made a function to deal with userid, mobile and email, as all these are unique in the base scenario
  // it can now be extended to any column of the db
  async getUserDataByParameterDB(criteria, values = []) {

    const query = `SELECT * FROM users WHERE ${criteria} AND is_deleted=0;`;

    // const query = `SELECT * FROM ${this.userTable} WHERE (${criteria}) AND is_deleted=0`;

    // console.log(query);
    let result;
    result = { success: false, msg: 'blank' }
    try {
      const results = await dbOps.execCustomQuery(query, values);
      // console.log(results)
      // console.log("--",results.length)
      if (results.length == 0)
        result = { success: false, msg: "User data not found", values: results }
      else
        result = { success: true, msg: "User data fetched successfully", values: results }
    } catch (error) {
      console.log("Error in getUserDataByParameterDB function: ", error)
      result = { success: false, msg: error }
    }
    return result;

  }

  async updateDataDB(userData, table) {
    // console.log(userData)
    const name = userData['name']
    const mobile = userData['mobile']
    const email = userData['email']
    const picture = userData['picture']
    const userTypeId = userData['userTypeId']
    const updatedAt = userData['updatedAt']

    delete userData.id;
    delete userData.username;
    delete userData.created_at;
    delete userData.password;
    delete userData.is_deleted;

    const data = userData
    const conditions = { "userid": userData['userid'] }

    // const query = `UPDATE ${this.userTable} SET name = ?, mobile = ?, email = ?, picture = ?, user_type_id = ?, updated_at = ? WHERE userid='${userData['userid']}';`
    let results;
    let result;
    try {
      // console.log("----a")
      results = await dbOps.updateData("users", data, conditions);
      result = { success: true, msg: "Updated user successfully" }
    } catch (error) {
      console.log("Error in updareDataDB function: ", error)
      // console.log(results)
      result = { success: false, msg: error }
    }
    return result
  }

  //acccess will be included once the user roles are defined.
  // by default access=1 meaning that the user is admin and has all the previleges
  async deleteUserDB(userid, access = 1) {
    let result;
    if (access == 1) {

      const query = `UPDATE users SET is_deleted=? WHERE userid=?;`
      const values = [1, userid];

      let results;
      let result;
      try {
        // console.log("----a")
        results = await dbOps.execCustomQuery(query, values);
        if (results.length == 0)
          result = { success: false, msg: "User data not found", values: results }
        else
          result = { success: true, msg: "User deleted successfully", values: results }
      } catch (error) {
        console.log("Error in getUserDataByParameterDB function: ", error)
        result = { success: false, msg: error }
      }
      return result;
    }
    else {
      // todo post user type definition
    }
    return result
  }

  async passwordCheckDB(userid, password) {

    try {
      let result = { success: 0, data: 'Wrong credentials' };

      const query = `SELECT password from users WHERE userid=? AND is_deleted=0;`


      try {
        let results = await dbOps.execCustomQuery(query, [userid]);
        // console.log(results[0].password)
        result = { success: true, msg: results }
      } catch (e) {
        result = { success: false, msg: err }
        consosle.log(e)
      }
      // console.log(result.msg[0].password)
      const hashedPassword = result.msg[0].password;
      // console.log(hashedPassword)

      const doPasswordsMatch = await bcrypt.compare(password, hashedPassword).then((results) => {
        if (!results) {
          result = { success: 0, data: 'Wrong credentials!!' };

          console.log('Password doesn\'t match!');
        } else {
          result = { success: 1, data: results };
          console.log('Password matches!');
          return result
        }
      });
      return result;
    } catch (e) {
      console.log("Error in passwordCheckDB function: ", error)
      let result = { success: false, data: e.message };
      return result;
    }
  }

  async updatePasswordDB(userid, newPassword) {

    const salt = await bcrypt.genSalt(Number(this.saltValue));
    const TokenizedPasswrod = await bcrypt.hash(newPassword, salt);

    let result = { success: 0, data: '' };

    const data = { 'password': TokenizedPasswrod };
    const conditions = { 'userid': userid };


    try {
      const results = await dbOps.updateData("users", data, conditions);
      result = { success: true, msg: results }

    } catch (e) {
      console.log("ERROR in updatePasswordDB function: ", e)
      result = { success: false, msg: e };

    }
    return result;

  }

}

