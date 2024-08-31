
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
