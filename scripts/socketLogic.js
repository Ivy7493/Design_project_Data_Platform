import { addPin, addRoute } from "./mapFunctions.js";
import { ChangePage, ToggleLogout } from "./pageController.js";
import { setAdminTable, RemoveAdminEntry } from "./tableFunctions.js";
import { displaySpeedForTrip } from "./graphFunctions.js";

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
        ChangePage(document,'MainPage')
        ToggleLogout(document)
        //addRoute(data)
    }
})

socket.on("getAdminData", (data)=>{
    setAdminTable(document,data)
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
    displaySpeedForTrip(data,document.getElementById('myChart'))
})


socket.on('hasAdminAccess', (data)=>{
    console.log("HELLO WE HERE")
    console.log(data)
    if(data == true){
        ChangePage(document,'adminPage')
        let temp2 = {
            token: sessionStorage.getItem("Token"),
            ID: ReturnSocketID()
        }
        SendToServer('getAdminData',temp2)
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
