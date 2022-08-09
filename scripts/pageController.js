const RegisterRef = "registrationPage"
const LoginRef = "loginPage"
const mainRef = "mainPage"
const adminRef = 'adminPage'

//
const logoutButton = 'logoutButton'
const adminButton = 'adminButton'



export function InitPages(document){
    document.getElementById(RegisterRef).style.display = "none";
    document.getElementById(mainRef).style.display = "none";
    document.getElementById(adminRef).style.display = "none";
    document.getElementById(logoutButton).style.display = "none";
    document.getElementById(adminButton).style.display = "none"
    document.getElementById(LoginRef).style.display = "initial";
    initAdminPage()
}

export function ChangePage(document,page){
    switch(page){
        case "Register":
            document.getElementById(RegisterRef).style.display = "initial";
            document.getElementById(mainRef).style.display = "none";
            document.getElementById(adminRef).style.display = "none";
            document.getElementById(LoginRef).style.display = "none";
            document.getElementById(adminButton).style.display = "none"
            break;
        case "Login":
            document.getElementById(RegisterRef).style.display = "none";
            document.getElementById(mainRef).style.display = "none";
            document.getElementById(adminRef).style.display = "none";
            document.getElementById(adminButton).style.display = "none"
            document.getElementById(LoginRef).style.display = "initial";
            break;
        case "MainPage":
            document.getElementById(RegisterRef).style.display = "none";
            document.getElementById(LoginRef).style.display = "none";
            document.getElementById(adminRef).style.display = "none";
            document.getElementById(adminButton).style.display = "initial"
            document.getElementById(mainRef).style.display = "initial";
            break;

        case "adminPage":
            document.getElementById(RegisterRef).style.display = "none";
            document.getElementById(LoginRef).style.display = "none";
            document.getElementById(mainRef).style.display = "none";
            document.getElementById(adminButton).style.display = "none"
            document.getElementById(adminRef).style.display = "initial";
            break;

    }
}


export function ToggleLogout(document){
    if(document.getElementById(logoutButton).style.display == 'none')
    document.getElementById(logoutButton).style.display = "none";

    switch(document.getElementById(logoutButton).style.display){
        case 'none':
            document.getElementById(logoutButton).style.display = 'initial'
            break;
        case 'initial':
            document.getElementById(logoutButton).style.display = 'none'
            break;
    }
}



////////////////////////////////////////////////////////////////////ADMIN CONTROL SECTION///////////////////////////////////////////////

const accountRef = "accountTab"
const driverRef = "driverTab"
const addDriverRef = 'addDriverTab'
const carRef = "carTab"
const addCarRef = 'addCarTab'


function initAdminPage(){
    document.getElementById(accountRef).style.display = "none"
    document.getElementById(driverRef).style.display = "none"
    document.getElementById(addDriverRef).style.display = "none"
    document.getElementById(carRef).style.display = "none"
    document.getElementById(addCarRef).style.display = "none"

}


export function ChangeAdminPage(page){
    switch(page){
        case "account":
            document.getElementById(accountRef).style.display = "initial"
            document.getElementById(driverRef).style.display = "none"
            document.getElementById(addDriverRef).style.display = "none"
            document.getElementById(carRef).style.display = "none"
            document.getElementById(addCarRef).style.display = "none"
            break;
        case "driver":
            document.getElementById(accountRef).style.display = "none"
            document.getElementById(addDriverRef).style.display = "none"
            document.getElementById(carRef).style.display = "none"
            document.getElementById(addCarRef).style.display = "none"
            document.getElementById(driverRef).style.display = "initial"
            break;
        case "addDriver":
            document.getElementById(accountRef).style.display = "none"
            document.getElementById(driverRef).style.display = "none"
            document.getElementById(carRef).style.display = "none"
            document.getElementById(addCarRef).style.display = "none"
            document.getElementById(addDriverRef).style.display = "initial"
            break;
        case 'car':
            document.getElementById(accountRef).style.display = "none"
            document.getElementById(driverRef).style.display = "none"
            document.getElementById(addDriverRef).style.display = "none"
            document.getElementById(addCarRef).style.display = "none"
            document.getElementById(carRef).style.display = "initial"
            break;
        case "addCar":
            document.getElementById(accountRef).style.display = "none"
            document.getElementById(driverRef).style.display = "none"
            document.getElementById(addDriverRef).style.display = "none"
            document.getElementById(carRef).style.display = "none"
            document.getElementById(addCarRef).style.display = "initial"
            break;



    }

}
