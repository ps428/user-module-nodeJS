/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

export const checkAccessToken = async (req, res, next) => {
  const token = req.cookies['accesstoken'];
  let userData;

  if (token) {
    // verifies secret and checks expiry
    // eslint-disable-next-line max-len
    const decodeAccessToken = jwt.verify(token, process.env.TOKEN_KEY, function(err, decoded) {
      userData = decodeAccessToken;
      if (err) {
        // eslint-disable-next-line max-len
        return res.status(401).json({'error': true, 'message': 'Unauthorized access.'});
      }
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    userData = 'Invalid token used';
    return res.status(403).send({
      'error': true,
      'message': 'No token provided.',
    });
  }

  return userData;
};
