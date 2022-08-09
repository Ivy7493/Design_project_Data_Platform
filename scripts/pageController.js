const RegisterRef = "registrationPage"
const LoginRef = "loginPage"
const mainRef = "mainPage"
const adminRef = 'adminPage'

//
const logoutButton = 'logoutButton'
const adminButton = 'adminButton'
const backButton = 'backButton'



export function InitPages(document){
    document.getElementById(RegisterRef).style.display = "none";
    document.getElementById(mainRef).style.display = "none";
    document.getElementById(adminRef).style.display = "none";
    document.getElementById(logoutButton).style.display = "none";
    document.getElementById(adminButton).style.display = "none"
    document.getElementById(LoginRef).style.display = "initial";
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
