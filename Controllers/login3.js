/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// //...... system imports ////
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import DbOperation from 'db_pkg';

// //.....user defined imports ////
import SessionClass from '../DbFunctions/new_session.js';
import Cipher from '../Common_functions/cipher.js';
import PasswordHash from '../Common_functions/password_hash.js';
// ///

const cipher_function = new Cipher;
const password_hashing_function = new PasswordHash;
const session_function = new SessionClass;


export async function login(req, response) { // login function
  let message;
  let verify_password;
  response.status(200);
  const username = req.body.username;
  const password = req.body.password;

  if (!(username && password)) { // check for username and password both are provided
    response.status(500).send('Please enter username and password');
  }

  let flag_user_exist = 0;
  const u_name= username;
  let db_password = '';
  let output;
  let getUserData;

  try {
    const fetch_values = [u_name];

    const sql = 'select * from users where userid= ?';

    getUserData = await DbOperation.execCustomQuery(sql, fetch_values);


    db_password = getUserData[0].password;


    if (getUserData.length != 0) {
      flag_user_exist = 1;
    }

    verify_password = password_hashing_function.verify_password(password, db_password);

    if (verify_password == false) {
      // eslint-disable-next-line no-undef
      throw err;
    }
  } catch (error) {
    message = [
      {
        'success': false,
        'message': 'Login failed',
      },
    ];

    response.status(401).json(message);
  }

  if (flag_user_exist == 1 ) { // first check username is exist in local parameter/db
    if (verify_password == true) {
      const get_user_name = getUserData[0].name; // fetch username and name from db/local stored
      const get_user_email = getUserData[0].email;


      const token = jwt.sign( // jwt token creation and storing in user table
          {user_data: get_user_name, get_user_email}, // payload
          process.env.TOKEN_KEY,
          {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
          },
      );

      const refreshToken = jwt.sign(
          {user_data: get_user_name, get_user_email},
          process.env.REFRESH_TOKEN_KEY,
          {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
          },
      );


      const payload= [ // response payload
        {
          'name': get_user_name,
          'email': get_user_email,
          'token': refreshToken,
        },
      ];


      response.cookie('userid', get_user_email); // saving the userid in cookies

      const inserttoken = await session_function.insertSession(u_name, refreshToken); // create a session entry after successfull login
      console.log(inserttoken);


      message = [ // display message - for postman
        {
          'success': true,
          'message': 'Login successfull.',
        },
      ];


      const encrypted_msg = cipher_function.encryption_f(JSON.stringify(payload)); // encrypting the payload @server, needs to be decrypt @ client side.

      response.status(200).json(message);
    } else {
      message = [
        {
          'success': false,
          'message': 'Login failed',
        },
      ];
      response.clearCookie('userid');
      response.status(403).json(message);
    }
  } else {
    message = [
      {
        'success': false,
        'message': 'login failed',
      },
    ];
    response.status(401).json(message);
  }
}
