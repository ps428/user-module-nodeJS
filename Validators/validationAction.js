/* eslint-disable max-len */
import {validationResult} from 'express-validator';

const validatorAction = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (!(errors.array().length==1 && errors.array()[0].param=='password' && req.body.password=='')) {
      return res.status(409).json({success: false, errors: errors.array()});
    }
  }

  next();
};

export {validatorAction};

