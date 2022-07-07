/* eslint-disable max-len */
/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';
// eslint-disable-next-line no-unused-vars
import cookieParser from 'cookie-parser';
import SessionClass from '../DbFunctions/new_session.js';


const sessionFunction = new SessionClass;


export const verifyToken = async (req, res, next) => {
  const uName = req.cookies['userid'];
  let fetchrefreshtoken;
  let fetchsession;
  const getUserEmail = uName;
  let getSessionData;

  try {
    getSessionData = await sessionFunction.fetchSessiondata(uName);

    fetchrefreshtoken = getSessionData.output[0].token;
    fetchsession = getSessionData.output[0].session_id;
  } catch (error) {
    // console.log(error);
    const result = {success: false, msg: 'No active session found.Please login first'};
    return res.status(403).send(result);
  }

  if (!fetchsession) {
    return res.status(401).send('no active session found against the user');
  }

  if (!fetchrefreshtoken) {
    return res.status(403).send('No refresh token found, Please login again.');
  }

  try {
    const decoded = jwt.verify(fetchrefreshtoken, process.env.REFRESH_TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token, authorization check failed. Please login again');
  }

  const accesstoken = jwt.sign( // jwt token creation and storing in user table
      {user_data: getUserEmail}, // payload
      process.env.TOKEN_KEY,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      },
  );


  res.cookie('accesstoken', accesstoken);
  return next();
};
