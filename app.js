import {loginRouter} from './Routes/Userloginroutes.js';

import express from 'express';
import {config} from 'dotenv';
import cookieParser from 'cookie-parser';

import {userRouter} from './Routes/userRoutes.js';

config();

const PORT = process.env.API_PORT || 5000;

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser());

// create server
app.listen(PORT, () => {
  console.log('Server is up and running on localhost:'+ PORT);
});

app.use('/api/userlogin', loginRouter);
app.use('/api/users', userRouter);

