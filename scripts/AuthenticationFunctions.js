let DB = require('./databaseFunctions')

const userModel = require("../scripts/models/userModel")
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
let config = require('./configs/authConfig')
let Mailer = require("./configs/mailerConfig");
const { user } = require('./configs/authConfig');


async function registerNewUser(userInfo){
    const token = jwt.sign({email: userInfo.email}, config.secret)
    let user = new userModel({
        username: userInfo.username,
        email: userInfo.email,
        password: bcrypt.hashSync(userInfo.password, 8),
        confirmationCode: token
    })
    try{
      let rep = await DB.registerNewUser(user)
      Mailer.sendConfirmationEmail(user.username,
        user.email,
        user.confirmationCode)
      return rep
    }catch(e){
        return -1
    }

}

async function hasAdminAccess(ID){
  let result = await DB.hasAdminAccess(ID);
  return result
}

async function loginUser(userInfo){
  await DB.returnSpeedData()  
  let temp = {
      username: userInfo.username,
      password: userInfo.password
    }
    let res = await DB.loginUser(temp)
    return res
}


async function confirmNewUser(confirmationCode){
    let result =  await DB.confirmNewUser(confirmationCode)
    return result
}

async function getAllUsers(confirmationCode){
  let result = await hasAdminAccess(confirmationCode)
  if(result == true){
    let res = await DB.retrieveAllAccounts()
    return res
  }
}

async function DeleteUser(user){
  let result = await DB.deleteUserAccount(user.email)
}

async function makeUserAdmin(user){
  let result = await DB.makeUserAdmin(user.username)
  return result
}

module.exports = {registerNewUser, confirmNewUser, loginUser, hasAdminAccess, getAllUsers, DeleteUser, makeUserAdmin}