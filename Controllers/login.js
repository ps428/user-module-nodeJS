/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
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

const cipherFunction = new Cipher;
const passwordHashingFunction = new PasswordHash;
const sessionFunction = new SessionClass;


export async function login(req, response) { // login function
  let message;
  let verifyPassword;
  response.status(200);
  const username = req.body.username;
  const password = req.body.password;

  // check for username and password both are provided
  if (!(username && password)) {
    response.status(500).send('Please enter username and password');
  }

  let flagUserExist = 0;
  const uName= username;
  let dbPassword = '';
  let output;
  let getUserData;

  try {
    const sql = 'select * from users where userid= ? and is_deleted= 0';

    getUserData = await DbOperation.execCustomQuery(sql, [uName]);

    dbPassword = getUserData[0].password;


    if (getUserData.length != 0) {
      flagUserExist = 1;
    }

    verifyPassword=passwordHashingFunction.verifyPassword(password, dbPassword);

    if (verifyPassword == false) {
      // eslint-disable-next-line no-undef
      throw error;
    }
  } catch (error) {
    console.log('login failed');
    message = [
      {
        'success': false,
        'message': 'Login failed',
      },
    ];

    return response.status(401).json(message);
  }


  // first check username is exist in db
  if (flagUserExist == 1 ) {
    if (verifyPassword == true) {
    // fetch username and name from db
      const getUserName = getUserData[0].name;
      const getUserEmail = getUserData[0].email;

      // jwt token creation and storing in user table
      const token = jwt.sign(
          {user_data: getUserName, getUserEmail}, // payload
          process.env.TOKEN_KEY,
          {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
          },
      );

      const refreshToken = jwt.sign(
          {user_data: getUserName, getUserEmail},
          process.env.REFRESH_TOKEN_KEY,
          {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
          },
      );


      const payload= [ // response payload
        {
          'name': getUserName,
          'email': getUserEmail,
          'token': refreshToken,
        },
      ];


      response.cookie('userid', getUserEmail); // saving the userid in cookies

      // create a session entry after successfull login
      const inserttoken=await sessionFunction.insertSession(uName, refreshToken);
      // console.log(inserttoken);


      message = [ // display message - for postman
        {
          'success': true,
          'message': 'Login successfull.',
        },
      ];

      // encrypting the payload @server, needs to be decrypt @ client side.
      const encMsg=cipherFunction.encryptionFunction(JSON.stringify(payload));

      response.status(200).json(message);
    } else {
      message = [
        {
          'success': false,
          'message': 'Login failed',
          'data': '1',
        },
      ];

      response.status(403).json(message);
    }
  } else {
    message = [
      {
        'success': false,
        'message': 'login failed',
        'data': '2',
      },
    ];
    response.status(401).json(message);
  }
}
