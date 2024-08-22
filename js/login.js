document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevenir el comportamiento por defecto del formulario (recarga de la página)

    // Obtener valores de los campos
    var usuario = document.getElementById("usuario").value;
    var contraseña = document.getElementById("contraseña").value;

    // Validar que ambos campos no estén vacíos
    if (usuario === "" || contraseña === "") {
        alert("Por favor, completa todos los campos.");
    } else {
        // Redireccionar a la página de portada 
        window.location.href = "index.html";
    }
});
