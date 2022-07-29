let DB = require('./databaseFunctions')
const userModel = require("../scripts/models/userModel")
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
let config = require('./configs/authConfig')
let Mailer = require("./configs/mailerConfig")


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
      console.log("YEEEE BUDDDY")
        return -1
    }

}

async function loginUser(userInfo){
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

module.exports = {registerNewUser, confirmNewUser, loginUser}