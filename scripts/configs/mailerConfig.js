const nodemailer = require("nodemailer");
const config = require("./authConfig");

const user = config.user;
const pass = config.pass;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
    console.log("Check");
    let port = process.env.PORT || 3000
    let addr = ""
    if(port == process.env.PORT){
        addr = 'city-energy.herokuapp.com'
        transport.sendMail({
            from: user,
            to: email,
            subject: "Please confirm your account",
            html: `<h1>Email Confirmation</h1>
                <h2>Hello ${name}</h2>
                <p>Thank you for registering with city energy. Please confirm your email by clicking on the following link</p>
                <a href=https://${addr}/confirm/?confirmationCode=${confirmationCode}>Confirm Account</a>
                </div>`,
          }).catch(err => console.log(err));
    }else{
        addr = '127.0.0.1'
        transport.sendMail({
            from: user,
            to: email,
            subject: "Please confirm your account",
            html: `<h1>Email Confirmation</h1>
                <h2>Hello ${name}</h2>
                <p>Thank you for registering with city energy. Please confirm your email by clicking on the following link</p>
                <a href=http://${addr}:${port}/confirm/?confirmationCode=${confirmationCode}>Confirm Account</a>
                </div>`,
          }).catch(err => console.log(err));
    }  
  };