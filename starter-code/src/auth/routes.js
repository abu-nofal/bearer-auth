'use strict';

const express = require('express');
const authRouter = express.Router();
const bcrypt=require('bcrypt')
const { users } = require('./models/index.js');
const basicAuth = require('./middleware/basic.js')
const bearerAuth = require('./middleware/bearer.js')

authRouter.post('/signup', async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    console.log("req.body.password :", req.body.password)
    let userRecord = await users.create(req.body);
    console.log(userRecord)
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(200).json(output);
  } catch (e) {
    next(e.message);
  }
});



authRouter.post('/signin', basicAuth, (req, res) => {
  const user = {
    user: req.user,
    token: req.user.token
  };
  res.status(200).json(user);
});

authRouter.get('/users', bearerAuth, async (req, res, next) => {
  const users = await users.findAll({});
  const list = users.map(user => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send("Welcome to the secret area!")
});


module.exports = authRouter;
