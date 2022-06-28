import { loginRouter } from "./Routes/Userloginroutes.js";



import express from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import cookieParser from "cookie-parser";

import {userRouter} from './Routes/userRoutes.js';

config();

const PORT = process.env.API_PORT || 5000;
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());

// create server 
app.listen(PORT, () => {
    console.log("Server is up and running on localhost:"+ PORT);
});


app.use("/api/userlogin", loginRouter);
app.use('/api/users', userRouter);


// app.post("/login",urlencodedParser,login);                                            //login page 

// app.get("/home",verifyToken,home);                                                    //home page - success after, JWT check pass

// app.post("/logout",urlencodedParser,logout);                                          //logout page

// app.get("/getdata",urlencodedParser,test_db);


