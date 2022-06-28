import express from "express";
import { login } from "../Controllers/login3.js";
import { home } from "../Views/home.js";
import { verifyToken } from "../Middleware/authorization.js";
import { logout } from "../Controllers/logout.js";
import bodyParser from "body-parser";

const urlencodedParser = bodyParser.urlencoded({ extended: false });

const loginRouter = express.Router();


loginRouter.post("/login",urlencodedParser,login);                                            //login page 
loginRouter.get("/home",verifyToken,home);                                                    //home page - success after, JWT check pass
loginRouter.post("/logout",urlencodedParser,logout);                                          //logout page



export {loginRouter};