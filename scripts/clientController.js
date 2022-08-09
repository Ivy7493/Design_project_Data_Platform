import { ChangePage, InitPages, ToggleLogout, ChangeAdminPage } from "./pageController.js";
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

let regBackButton = document.getElementById('regBackButton')


///Admin page control

//Account binds
let adminButton = document.getElementById('adminButton')
let deleteButton = document.getElementById('deleteAccount')
let setAdminButton = document.getElementById("setAdminButton")
let accountButton = document.getElementById("accountButton")

//driver binds
let driverButton = document.getElementById("driverButton")
let deleteDriver = document.getElementById("deleteDriverButton")
let addDriverButton = document.getElementById('addDriverButton')
let createDriverButton = document.getElementById('createDriverButton')


InitPages(document)
//Car binds
let carButton = document.getElementById('carButton')
let deleteCarButton = document.getElementById('deleteCarButton')
let addCarButton = document.getElementById('addCarButton')
let createCarButton = document.getElementById('createCarButton')

createCarButton.addEventListener('click',function(){
    let tempName = document.getElementById("carName").value
    let tempMass = document.getElementById("massCar").value
    let tempArea = document.getElementById('areaCar').value
    let tempID = ReturnSocketID()
    let temp = {
        name: tempName,
        mass: tempMass,
        area: tempArea,
        ID: tempID
    }
    SendToServer("createNewCar",temp)
    ChangeAdminPage('car')
})

addCarButton.addEventListener("click",function(){
    ChangeAdminPage('addCar')
})

carButton.addEventListener('click',function(){
    ChangeAdminPage('car')
})

deleteCarButton.addEventListener('click',function(){
    let temp = getCurrentTableSelection()
    let id = ReturnSocketID()
    let entry = {
        carID: temp[0].CarID,
        ID: id
    }
    SendToServer("deleteCar",entry)
})


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

accountButton.addEventListener('click', function (){
    let temp2 = {
        ID: ReturnSocketID()
    }
    ChangeAdminPage('account')
})

driverButton.addEventListener('click',function(){
    let temp2 = {
        ID: ReturnSocketID()
    }
    ChangeAdminPage('driver')
})

deleteDriver.addEventListener('click',function(){
    let temp = getCurrentTableSelection()
    let temp2 = {
        ID: ReturnSocketID(),
        driverID: temp[0].DriverID

    }
    console.log("What we sending: ", temp2)
    SendToServer('deleteDriver',temp2)
})

addDriverButton.addEventListener('click',function(){
    let temp2 = {
        ID: ReturnSocketID()
    }
    SendToServer("getAllCars",temp2)
    ChangeAdminPage('addDriver')
})

createDriverButton.addEventListener('click',function(){
    let tempName = document.getElementById('driverName').value
    let holder = document.getElementById('driverCar')
    let tempCar = holder.options[holder.selectedIndex].value
    let tempID = ReturnSocketID()
    let temp = {
        name: tempName,
        car: tempCar,
        ID: tempID
    }
    SendToServer('createNewDriver',temp)
    ChangeAdminPage('driver')
})

///////END OF ADMIN SECTION//////////////////////

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
    //SendToServer("getAverageSpeed",temp)
    SendToServer('getGraphData',temp)
})




