
// init.js ya está referenciado en todos los html

const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";


//// Se crea una función para almacenar los datos en el localStorage
function saveToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

//// se declara la constante que trae el elemento del switch 
const themeSwitch = document.getElementById('themeSwitch');
 
//// se crea el evento que se activa cuando el estado del switch cambia
themeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode'); //se añade la clase dark-mode al bod si no está presente, o la elimina si ya está presente.
  
  const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  saveToLocalStorage('theme', theme); //se guarda el tema en localStorage con la funcion que definimos antes
});




let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

    // NOMBRE DE USUARIO EN LA BARRA SUPERIOR
// - obtener el nombre de usuario almacenado en localStorage
let usuario = localStorage.getItem("usuario");

// Si hay un nombre de usuario, mostrarlo en el botón del menú desplegable
if (usuario) {
    document.querySelector(".dropdown-toggle").textContent = usuario;
}

// Función para verificar si el usuario ha iniciado sesión
function checkLogin() {
    let isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        window.location.href = "login.html"; // Redirigir a la página de inicio de sesión
    }
}

// Llamar a la función checkLogin al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    checkLogin();

//// al cargar la pagina se aplica el tema guardado
  const savedTheme = localStorage.getItem('theme'); //se trae el valor de la clave theme del localStorage
  if (savedTheme) { // se verifica que tenga un valor
      document.body.classList.toggle('dark-mode', savedTheme === 'dark'); // se accede a la lista de clases del elemento body 
      // si el el valor guardado es dark, con toggle se añade la clase dark-mode, de lo contrario se elimina.
      themeSwitch.checked = savedTheme === 'dark'; //se actualiza el estado del switch
  }

});

document.getElementById("logout").addEventListener("click", function () {
  // Eliminar el nombre de usuario de localStorage
  localStorage.removeItem("usuario");
  // Eliminar el estado de sesión
  sessionStorage.removeItem("isLoggedIn");
  // Redirigir a la página de inicio de sesión
  window.location.href = "login.html";
});


window.onload = checkLogin;

// checkLogin antes estaba presente al final de cada código en los siguientes js: 
// products.js, sell.js, product-info.js (excepcionalmente se encontraba al principio), 
// my-profile.js, index.js, categories.js, cart.js.



