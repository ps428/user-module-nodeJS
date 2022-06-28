/* eslint-disable no-undef */
import jwt from "jsonwebtoken";
// eslint-disable-next-line no-unused-vars
import cookieParser from "cookie-parser";
import SessionClass from "../DbFunctions/new_session.js";


let session_function = new SessionClass;


export const verifyToken =  async(req, res, next) => {
  
  const u_name = req.cookies["userid"];
  let fetchrefreshtoken;
  let fetchsession;   
  const get_user_email = u_name;
  let get_session_data;

      try{
        
        get_session_data = await session_function.fetchSessiondata(u_name);

        fetchrefreshtoken = get_session_data.output[0].token;
        fetchsession = get_session_data.output[0].session_id;

       
        }

      catch(error){
        console.log(error);
        let result = {success:false,msg:"No active session found.Please login first"};
        res.status(403).send(result);

      }
  
  if(!fetchsession){
    res.status(401).send("no active session found against the user");
  }

  if(!fetchrefreshtoken){
    res.status(403).send("No refresh token found, Please login again.");
  }

  try {
    const decoded = jwt.verify(fetchrefreshtoken, process.env.REFRESH_TOKEN_KEY);
    req.user = decoded;
    

  } catch (err) {
    res.status(401).send("Invalid Token, authorization check failed. Please login again");
  }

  const accesstoken = jwt.sign(                                                             //jwt token creation and storing in user table
                {user_data:get_user_email},                                                 // payload
                process.env.TOKEN_KEY,                                                           
                {
                  expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
                }
            );
  
  
  res.cookie("accesstoken",accesstoken);     
  return next();
};
