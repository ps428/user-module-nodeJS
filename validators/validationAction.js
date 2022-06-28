import {validationResult} from 'express-validator';
// const { validationResult } = require('express-validator')

const validatorAction = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(409).json({success: false, errors: errors.array()});
  }

  next();
};

export {validatorAction};

