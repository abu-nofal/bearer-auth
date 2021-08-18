'use strict';

const base64 = require('base-64');
const { users } = require('../models/index')

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { return _authError(); }

  // let basic = req.headers.authorization.split(' ').pop();
  // let decoded=base64.decode(basic);
  // let [username, pass] = decoded.split(':');


  let basicHeaderParts = req.headers.authorization.split(' '); // ['Basic', encoded(username:password)]
  let encoded = basicHeaderParts.pop();
  let decoded = base64.decode(encoded); // username:password
  let [username, pass] = decoded.split(":"); // rawan test@1234

  try {
    req.user = await users.authenticateBasic(username, pass)
    next();
  } catch (e) {
    res.status(403).send('Invalid Login');
  }

}

