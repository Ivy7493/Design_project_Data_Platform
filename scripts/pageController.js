const RegisterRef = "registrationPage"
const LoginRef = "loginPage"
const mainRef = "mainPage"



export function InitPages(document){
    document.getElementById(RegisterRef).style.display = "none";
    document.getElementById(mainRef).style.display = "none";
    document.getElementById(LoginRef).style.display = "initial";
}

export function ChangePage(document,page){
    switch(page){
        case "Register":
            document.getElementById(RegisterRef).style.display = "initial";
            document.getElementById(mainRef).style.display = "none";
            document.getElementById(LoginRef).style.display = "none";
            break;
        case "Login":
            document.getElementById(RegisterRef).style.display = "none";
            document.getElementById(mainRef).style.display = "none";
            document.getElementById(LoginRef).style.display = "initial";
            break;
        case "MainPage":
            document.getElementById(RegisterRef).style.display = "none";
            document.getElementById(LoginRef).style.display = "none";
            document.getElementById(mainRef).style.display = "initial";

    }
}