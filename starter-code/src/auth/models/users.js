'use strict';
const SECRET =  "mysecretkey";
const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken')

const userSchema = (sequelize, DataTypes) => {
  const model = sequelize.define('user2', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false, },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        return jwt.sign({ username: this.username },SECRET);
      },
      set(tokenObj) {
        return jwt.sign(tokenObj, SECRET);
     }
    
      
    }
  });

  model.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
     
  });

  // Basic AUTH: Validating strings (username, password) 
  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: {username: username} })
    
    console.log("authenticateBasic user : ", user);
    console.log("password :", password);
    console.log("user.password : ", user.password)
    const valid = await bcrypt.compare(password, user.password);
        console.log("valid : ", valid);
        if (valid) {
            return user;
        }
        throw new Error('Invalid UserName and Password');
  }




  // Bearer AUTH: Validating a token
  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, SECRET);
      const user = this.findOne({where: { username: parsedToken.username } });
      if (user) { return user; }
      throw new Error("User Not Found");
    } catch (e) {
      throw new Error(e.message)
    }
  };

  return model;
}

module.exports = userSchema;
