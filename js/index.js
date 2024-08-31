document.addEventListener("DOMContentLoaded", function(){
    //- obtener el nombre de usuario almacenado en localStorage
    let usuario = localStorage.getItem("usuario");
    // Si hay un nombre de usuario, mostrarlo en la barra de navegación
    if(usuario){
        document.getElementById("usuario").textContent = usuario;
    }

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
    let isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        window.location.href = "login.html";
    }
}

window.onload = checkLogin;
