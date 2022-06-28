/* eslint-disable no-undef */
import express from 'express';
// Importing user router to deal with users
// import dotenv from 'dotenv';

// const dotenv = require('dotenv');
// dotenv.config();
import {userRouter} from './routes/userRoutes.js';
// env config
// console.log(process.env)
// const express = require('express')
const app = express();

// setup db
// eslint-disable-next-line no-unused-vars
// import {connection} from './dbConfig.js'

// const userRouter = require('./routes/user')

// to read json and access user's response's body
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req,res)=>{
  return res.send("User CRUD and Password Change")
});
console.log("calling users route");
app.use('/api/users', userRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.port || 3000}...`);
});
