/* eslint-disable no-unused-vars */
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
// import { config } from "dotenv";

// config();



export const checkAccessToken = async (req,res,next) => {
  

  const token = req.cookies["accesstoken"];
  console.log("access token @home "+token);
  let userData;

  if (token) {
// verifies secret and checks exp
  const decodeAccessToken = jwt.verify(token, process.env.TOKEN_KEY, function(err, decoded) {
  userData = decodeAccessToken;     
  if (err) {
    return res.status(401).json({"error": true, "message": "Unauthorized access." });
  }
  req.decoded = decoded;
  next();
  });
  } 
  
  else {
// if there is no token
// return an error
    userData = "Invalid token used";
    return res.status(403).send({
          "error": true,
          "message": "No token provided."
          });

}

  return userData; 

};  