import { ChangePage, InitPages, ToggleLogout } from "./pageController.js";
import { SendToServer, ReturnSocketID } from "./socketLogic.js"

let userField = document.getElementById("username");
let passField = document.getElementById("password");
let emailField = document.getElementById("email")

let ShowregisterButton = document.getElementById('ShowRegister');

let loginButton = document.getElementById("login");
let registerButton = document.getElementById("register")
let logoutButton = document.getElementById('logoutButton')
InitPages(document)



ShowregisterButton.addEventListener('click',function (){
    ChangePage(document,'Register')
})

logoutButton.addEventListener('click',function (){
    SendToServer('logout',"YAAAS")
    ChangePage(document,'Login')
    ToggleLogout(document)
    
})


registerButton.addEventListener('click',function(){
    let account = {
        username: userField.value,
        password: passField.value,
        email: emailField.value,
        ID: ReturnSocketID()
    }
    try{
        SendToServer('register',account)
        window.alert("Confirmation Email sent")
        ChangePage(document,'Login')
    }catch(e){
        window.alert("Registration failed ", e)
    }
    
})

loginButton.addEventListener('click',function (){
    let temp = {
        username: userField.value,
        password: passField.value,
        ID: ReturnSocketID()
    }
    //socket.emit('login', temp)
    SendToServer('login',temp)
})
