document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});

function checkLogin() {
    // Verificar si hay una sesión activa
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    // Si no hay sesión activa, redirigir a login.html
    if (!isLoggedIn) {
        window.location.href = "login.html";
    }
}

// Ejecutar checkLogin cuando la página cargue
window.onload = checkLogin;