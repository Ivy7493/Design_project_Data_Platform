
import { addPin } from "./mapFunctions.js";
import { ChangePage } from "./pageController.js";

var socket = io();
let socketID = ""
socket.on("Welcome", (data) => {
   console.log("Connected to server! Full speed ahead captin")
});


socket.on("registration",(data)=>{
    window.alert(data)
})

socket.on('login',(data)=>{
    window.alert(data)
    if(data == 1){
        console.log("Poggers")
        ChangePage(document,'MainPage')
    }
})

socket.on('getRouteData',(data)=>{
    addPin(data)
})


export function SendToServer(event,data){
    socket.emit(event,data)
}

export function ReturnSocketID(){
    return socket.id
}
