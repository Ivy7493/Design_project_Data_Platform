import { ChangePage, InitPages, ToggleLogout } from "./pageController.js";
import { SendToServer, ReturnSocketID } from "./socketLogic.js"
import { getCurrentTableSelection } from "./tableFunctions.js"

let ReguserField = document.getElementById("Regusername");
let RegpassField = document.getElementById("Regpassword");
let RegemailField = document.getElementById("Regemail")

let userField = document.getElementById('username')
let passField = document.getElementById("password")

let ShowregisterButton = document.getElementById('ShowRegister');

let loginButton = document.getElementById("login");
let registerButton = document.getElementById("register")
let logoutButton = document.getElementById('logoutButton')
let deleteButton = document.getElementById('deleteAccount')
let setAdminButton = document.getElementById("setAdminButton")
let adminButton = document.getElementById('adminButton')
let regBackButton = document.getElementById('regBackButton')

InitPages(document)


adminButton.addEventListener('click',function(){
    let temp2 = {
        token: sessionStorage.getItem("Token"),
        ID: ReturnSocketID()
    }
    SendToServer('hasAdminAccess',temp2)
})

setAdminButton.addEventListener('click',function(){
    let temp = getCurrentTableSelection()
    let id = ReturnSocketID()
    let entry = {
        username: temp[0].username,
        ID: id,
        email: temp[0].email,
        access: temp[0].access
    }
    SendToServer("makeAdmin",entry)
})

deleteButton.addEventListener('click',function(){
    let temp = getCurrentTableSelection()
    let id = ReturnSocketID()
    let entry = {
        username: temp[0].username,
        ID: id,
        email: temp[0].email,
        access: temp[0].access
    }
    SendToServer("deleteUser",entry)
})

ShowregisterButton.addEventListener('click',function (){
    ChangePage(document,'Register')
})

regBackButton.addEventListener('click',function (){
    ChangePage(document,'Login')
})

logoutButton.addEventListener('click',function (){
    SendToServer('logout',"YAAAS")
    ChangePage(document,'Login')
    ToggleLogout(document)
})


registerButton.addEventListener('click',function(){
    let account = {
        username: ReguserField.value,
        password: RegpassField.value,
        email: RegemailField.value,
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
    SendToServer('login',temp)
    //SendToServer('getRouteData',temp)
})




