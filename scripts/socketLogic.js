import { addPin, addRoute } from "./mapFunctions.js";
import { ChangePage, ToggleLogout } from "./pageController.js";
import { setAdminTable, RemoveAdminEntry, setDriverTable, setCarTable } from "./tableFunctions.js";
import { displayEnergyForTrip } from "./graphFunctions.js";
import { displayTotalEnergyForTrip } from "./graphFunctions.js";


var socket = io();
let socketID = ""
socket.on("Welcome", (data) => {
   console.log("Connected to server! Full speed ahead captin")
});


socket.on("registration",(data)=>{
    window.alert(data)
})

socket.on('login',(data)=>{
    if(data != -1){
        sessionStorage.setItem("Token", data);
        ChangePage('MainPage')
        ToggleLogout(document)
        //addRoute(data)
    }
})

socket.on("getAdminData", (data)=>{
    setAdminTable(document,data)
})

socket.on("getAllDrivers",(data)=>{
    
        let selectElement = document.getElementById('driver')
        let i, L = selectElement.options.length - 1;
       for(i = L; i >= 0; i--) {
          selectElement.remove(i);
        }
       console.log("eyyyyyyyyyyyy")
       console.log(data)   
       data.map(x=>{
            let option = document.createElement("OPTION");
            //Set Customer Name in Text part.
            option.innerHTML = x.name
            //Set CustomerId in Value part.
            option.value = x.driverID;
            selectElement.options.add(option);
       })
       setDriverTable(data)

        
})

socket.on("deleteDriver", (data)=>{
    window.alert("Driver Deleted: ", data)
})

socket.on('createNewDriver',(data)=>{
    window.alert("Driver: ", data)
})

socket.on("changeDriverDevice",(data)=>{
    window.alert("Driver ID Changed: ",data)
})

//Car management Section
socket.on('getAllCars',(data)=>{
    let selectElement = document.getElementById('driverCar')
    let i, L = selectElement.options.length - 1;
   for(i = L; i >= 0; i--) {
      selectElement.remove(i);
   }
   console.log("YEEEEE")
   console.log(data)   
   data.map(x=>{
        let option = document.createElement("OPTION");
        //Set Customer Name in Text part.
        option.innerHTML = x.name
        //Set CustomerId in Value part.
        option.value = x.carID;
        selectElement.options.add(option);
   })
    setCarTable(data)
})


//DATA section
socket.on('calculateDriverData',(data)=>{
    console.log("We got our reponse!!! ", data)
    addRoute(data[0])
    displayEnergyForTrip(data,document.getElementById('myChart'))
})

socket.on('getRouteData',(data)=>{
    //addPin(data)
    //addPin(data)
    addRoute(data)
})

socket.on('getSpeedData',(data)=>{
    console.log("speed: ")
    console.log(data)
    displaySpeedForTrip(data,document.getElementById("myChart"))
})

socket.on('getGraphData',(data)=>{
    console.log("speedTime: ")
    console.log(data)
    displayEnergyForTrip(data,document.getElementById('myChart'))
})

socket.on('getBarGraphData',(data)=>{
    console.log("AverageSpeed: ")
    console.log(data)
    displayTotalEnergyForTrip(data,document.getElementById('myChart2'))
})

socket.on('hasAdminAccess', (data)=>{
    if(data == true){
        ChangePage('adminPage')
        let temp2 = {
            token: sessionStorage.getItem("Token"),
            ID: ReturnSocketID()
        }
        //Gets access
        SendToServer('getAdminData',temp2)
        SendToServer('getAllDrivers',temp2)
        SendToServer('getAllCars',temp2)
    }else{
        window.alert("You do not have admin access!")
    }
})

socket.on('deleteUser',(data)=>{
    console.log(data)
    RemoveAdminEntry()
})

socket.on('makeAdmin', (data)=>{
    let temp2 = {
        token: sessionStorage.getItem("Token"),
        ID: ReturnSocketID()
    }
    SendToServer('getAdminData',temp2)
})


export function SendToServer(event,data){
    socket.emit(event,data)
}

export function ReturnSocketID(){
    return socket.id
}
