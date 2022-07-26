/* eslint-disable require-jsdoc */
// eslint-disable-next-line no-unused-vars
import cookieParser from 'cookie-parser';
import {checkAccessToken} from '../Middleware/accessTokenCheck.js';


export function home(req, res) {
  let message;
  try {
    checkAccessToken;

    message = {

      success: true,
      message: 'welcome home',
    };

    res.status(200).json(message);
  } catch (error) {
    message = {

      success: false,
      message: error,

    };
    res.status(401).json(message);
  }
}

