/*Pilar*/
function loginUser(username, password) {
    // Validar usuario y contraseña
    if (isValidUser(username, password)) {
        // Guardar la sesión en el sessionStorage
        sessionStorage.setItem("isLoggedIn", "true");
        // Redirigir a la página principal
        window.location.href = "index.html";
    } else {
        // Mostrar un mensaje de error si los datos son incorrectos
        alert("Usuario o contraseña incorrecta.");
    }
}

function isValidUser(username, password) {
    // Aquí puedes poner la lógica para validar los datos
    // Por ejemplo, comparar con un usuario y contraseña específicos
    return username === "usuario" && password === "contraseña";
}

