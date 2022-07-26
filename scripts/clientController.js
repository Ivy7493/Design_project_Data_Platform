import { ChangePage, InitPages, ToggleLogout, ChangeAdminPage, ChangeDataPage } from "./pageController.js";
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

//Back Binds
let adminBackButton = document.getElementById("adminBackButton")

//Account binds
let adminButton = document.getElementById('adminButton')
let deleteButton = document.getElementById('deleteAccount')
let setAdminButton = document.getElementById("setAdminButton")
let accountButton = document.getElementById("accountButton")

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
    let tempDrag = document.getElementById('dragCar').value
    let tempType = document.getElementById('carType').options[document.getElementById('carType').selectedIndex].value
    let tempID = ReturnSocketID()
    let temp = {
        name: tempName,
        mass: tempMass,
        area: tempArea,
        drag: tempDrag,
        fuelType: tempType,
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


///DRIVER SECTION

let driverButton = document.getElementById("driverButton")
let deleteDriver = document.getElementById("deleteDriverButton")
let addDriverButton = document.getElementById('addDriverButton')
let createDriverButton = document.getElementById('createDriverButton')
let editDriverButton = document.getElementById('editDriverButton')

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
    let tempDeviceID = document.getElementById('deviceID').value
    let tempCar = holder.options[holder.selectedIndex].value
    let tempID = ReturnSocketID()
    if(tempName.length<3)
    {
        alert("Please enter name up to 3 digits!")

    }
    if(tempDeviceID.length!=7)
    {
        alert("Please enter 7 digits for device ID!")

    }
    else if(tempDeviceID.length===7 && tempName.length>=3)
    {
           
    let temp = {
        name: tempName,
        car: tempCar,
        ID: tempID,
        deviceID: tempDeviceID
    }
    SendToServer('createNewDriver',temp)
    ChangeAdminPage('driver')
}
})

editDriverButton.addEventListener('click',function(){
    let id = ""
    while(id.length < 3){
        id = prompt("Please enter the new device ID: ","")
    }
    let temp = getCurrentTableSelection()
    let temp2 = {
        ID: ReturnSocketID(),
        driverID: temp[0].DriverID,
        deviceID: id
    }
    SendToServer("changeDriverDevice",temp2)
})

adminBackButton.addEventListener('click',function(){
    ChangePage("MainPage")
})

///////END OF ADMIN SECTION//////////////////////

////////LOGIN AND REGISTER SECTION//////////

ShowregisterButton.addEventListener('click',function (){
    ChangePage('Register')
})

regBackButton.addEventListener('click',function (){
    ChangePage('Login')
})

logoutButton.addEventListener('click',function (){
    SendToServer('logout',"YAAAS")
    ChangePage('Login')
    ToggleLogout(document)
})


registerButton.addEventListener('click',function(){

  let Password=RegpassField.value
  let Email=RegemailField.value
  let hasCapital
  let hasNumber
  let counterC=0
  let counterN=0
  let counterE=0

    for(let i=0; i<Password.length;i++)   
    {
        
         
        if (/^[\x41-\x5A]+$/.test(Password[i])===true)
        {
          counterC++
       
            
        }
        if(/^[\u0030-\u0039]*$/.test(Password[i])===true)
        {
            counterN++
            
        }
       

    }

    for(let i=0; i<Email.length;i++)   
    {
           
        if (/^[\x40]+$/.test(Email[i])===true)
        {
          counterE++ 
        }
       

    }

    if (counterC>0)
    {

        hasCapital=true
        counterC=0
    }
    else if(counterC===0)
    {
        hasCapital=false

    }
    if (counterN>0)
    {
        hasNumber=true
        counterN=0
        
    }
    else if(counterN===0)
    {
        hasNumber=false
        
    }

    if(hasCapital===false)
    {
     
        alert("Password must have at least one Capital Letter")
       
    }
    if(hasNumber===false)
    {
        
        alert("Password must have at least one Number")
        
    }
    if(counterE===0)
    {
        
        alert("Invalid Email => '@'")
        
    }
    else if(hasCapital==true && hasNumber==true&&counterE===1)
    {
        let account = {
            username: ReguserField.value,
            password: Password,
            email: Email,
            ID: ReturnSocketID()
        }
        try{
            SendToServer('register',account)
            window.alert("Confirmation Email sent")
            ChangePage('Login')
        }catch(e){
            window.alert("Registration failed ", e)
        }

    }
   
    
})

loginButton.addEventListener('click',function (){
    let temp = {
        username: userField.value,
        password: passField.value,
        ID: ReturnSocketID()
    }
    SendToServer('login',temp)
    SendToServer('calculateTotalEnergy',temp)
    //SendToServer("getAverageSpeed",temp)
    
})


///////Data Section//////


let DisplayBarGButton = document.getElementById('DisplayBarGButton')
let DisplayLineGButton = document.getElementById('DisplayLineGButton')
let selectDriverButton = document.getElementById('driver')

selectDriverButton.addEventListener('change',function(){
    let tempID = selectDriverButton.options[selectDriverButton.selectedIndex].value 
    let tempName = selectDriverButton.options[selectDriverButton.selectedIndex].text

    let temp = {
        driverID: tempID,
        ID: ReturnSocketID(),
        driverName: tempName
    }
    SendToServer('calculateDriverData',temp)
    ChangeDataPage("perSecondEnergy")
})

DisplayBarGButton.addEventListener('click',function(){
    
    
    let temp2 = {
        ID: ReturnSocketID()  
    }
    
    ChangeDataPage("totalEnergy")
})

DisplayLineGButton.addEventListener('click',function(){
    
    let temp2 = {
        ID: ReturnSocketID()
    }
    SendToServer("getAllDrivers",temp2)

    ChangeDataPage("perSecondEnergy")
})

