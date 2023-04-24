const express = require('express');
const app = express();
const Registration = require('../models/register.models');
const Authentication = require("../middleware/authentication");
const bcrypt = require('bcrypt');
const { signInSchema, signUpSchema } = require('../validator/validation')

// const http = require('http')
// const server = http.createServer(app)

app.use(express.json())

// app.get('/', async (req, res) => {
//   try{
//     const data = await Registration.findOne({email : req.body.email});    
//     res.status(200).send({statusCode:'200', message : "Details fetched Successfully", data: data});
//   } catch(error){
//     console.log(error)
//   }
// })

app.post('/signUp', async (req, res) => {
  try {
    await signUpSchema.validateAsync(req.body);
    const userExists = await Registration.findOne({ email: req.body.email });

    if (userExists) {
      return res.status(400).send("Email already exists");
    }
    //Password Hashing
    const saltRound = 10;
    const hashPassword = await bcrypt.hash(req.body.password, saltRound);

    const user = {
      email: req.body.email,
      name: req.body.name,
      password: hashPassword,
    }
    const register = new Registration(user);
    await register.save();
    res.status(200).send({ statusCode: '200', message: "Successfully Registered" });

  } catch (error) {
    console.log("Error in SignUp API: ", error);
    res.status(500).send({ statusCode: '500', message: error.message });
  }
})

app.post('/signIn', async (req, res) => {
  try {
    await signInSchema.validateAsync(req.body);
    const usersData = await Registration.findOne({ email: req.body.email });

    if (!usersData) {
      return res.status(400).send({ statusCode: '400', message: "Account does not exists" });
    }
    const passwordMatch = await bcrypt.compare(req.body.password, usersData.password);
    if (passwordMatch) {
      const userDetails = {
        email: usersData.email,
        name: usersData.name
      };
      const token = await Authentication.getJwtToken(userDetails);
      let data = { usersData, token };
      return res.status(200).send({ statusCode: '200', message: "Successfully logged In", data: data });
    } else {
      return res.status(401).send({ statusCode: '401', message: "Invalid Password" });
    }
  } catch (error) {
    console.log("Error in SignIn API: ", error);
    res.status(500).send({ statusCode: '500', message: error.message });
  }
})

app.post('/signOut', async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: "Logout Succesfully" })
})

module.exports = app;