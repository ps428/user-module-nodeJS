/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import bcrypt from 'bcrypt';

export default class PasswordHash {
  constructor() {

  }

  // hash the password , this method is for registration
  hashPassword(password) {
    return hashedPasswd = bcrypt.hashSync(password, 10);
  }

  // verifiy the password for login
  verifyPassword(userGivenPassword, dbstoredPassword) {
    return verifyPasswd = bcrypt.compareSync(userGivenPassword, dbstoredPassword);
  }

  async createPassword() {
    const length = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    console.log(retVal);
    return retVal;
  }
}
