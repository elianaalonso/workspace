/*Pilar*/

function checkLogin() {
    /* Verificar si hay sesión */
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");

    /* Si no hay sesión redirigir a login.html */
    if (!isLoggedIn) {
        window.location.href = "login.html";
    }
}
window.onload = checkLogin;
 

