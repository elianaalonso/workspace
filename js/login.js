/*Pilar*/
function loginUser(username, password) {
    if (isValidUser(username, password)) {
        sessionStorage.setItem("isLoggedIn", "true");
        window.location.href = "index.html";
    } else {
        alert("Usuario o contraseña incorrecta.");
    }
}

function isValidUser(username, password) {
    return username === "usuario" && password === "contraseña";
}