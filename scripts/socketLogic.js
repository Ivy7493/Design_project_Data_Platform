
import { addPin } from "./mapFunctions.js";

var socket = io();
let socketID = ""
socket.on("Welcome", (data) => {
   console.log("Connected to server! Full speed ahead captin")
});

socket.on("registration_Successful", (data) => {
    window.alert(data)
});

socket.on("registration_Failed",(data)=>{
    window.alert(data)
})

socket.on('login',(data)=>{
    window.alert(data)
})

socket.on('getRouteData',(data)=>{
    addPin(data)
})


let userField = document.getElementById("username");
let passField = document.getElementById("password");
let registerButton = document.getElementById('register');
let loginButton = document.getElementById("login");



registerButton.addEventListener('click',function (){
    let temp = {
        username: userField.value,
        password: passField.value,
        email: "Ivanblizz23@gmail.com",
        ID: socket.id
    }
    socket.emit('register', temp)
})

loginButton.addEventListener('click',function (){
    let temp = {
        username: userField.value,
        password: passField.value,
        ID: socket.id
    }
    socket.emit('login', temp)
})

