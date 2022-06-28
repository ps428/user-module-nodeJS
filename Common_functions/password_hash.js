import bcrypt from "bcrypt";

export default class PasswordHash {
  constructor() {

  }
  
  //hash the password , this method is for registration
  hash_password(password) {
    const hashed_passwd = bcrypt.hashSync(password, 10);
    return hashed_passwd;
  }

  // verifiy the password for login
  verify_password(user_given_password, dbstored_password) {
    const verify_passwd = bcrypt.compareSync(user_given_password, dbstored_password);
    return verify_passwd;
  }

  async createPassword() {
    const length = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }
}