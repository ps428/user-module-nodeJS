/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';
// Checking middleware
// For token authorization to a loggedin user
// eslint-disable-next-line require-jsdoc
export function auth(req, res, next) {
  const token = req.headers['auth-token'];
  if (!token) {
    return res.status(401).send('Access Denied!');
  } else {
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = verified;
      console.log(req.user)
      next();
    } catch (err) {
      res.status(400).send('Invalid token!');
    }
  }
}
