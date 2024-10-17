
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevenir el comportamiento por defecto del formulario (recarga de la página)

    // Obtener valores de los campos
    let usuario = document.getElementById("usuario").value;
    let contraseña = document.getElementById("contraseña").value;

    // Validar que ambos campos no estén vacíos
    if (usuario === "" || contraseña === "") {
        alert("Por favor, completa todos los campos.");
        
    } else {
        //- Guardar el nombre de usuario en localStorage-
        localStorage.setItem("usuario", usuario);

        // Redireccionar a la página de portada 
        window.location.href = "index.html";
    }
});
sessionStorage.setItem("isLoggedIn", "true");
function isValidUser(username, password) {
    return username !== "" && password !== "";
}

document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

    // Obtener el valor del campo de email
    const email = document.getElementById("usuario").value;

    // Validar que el email no esté vacío
    if (email === "") {
        alert("Por favor, completa el campo de email.");
    } else {
        // Guardar el email en localStorage
        localStorage.setItem("loggedInEmail", email);

        // Redireccionar a la página principal o portada
        window.location.href = "index.html";
    }
});