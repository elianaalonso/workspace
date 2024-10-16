
// init.js ya está referenciado en todos los html

const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";


function saveToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}
 
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

    // NOMBRE DE USUARIO EN LA BARRA SUPERIOR//
//- obtener el nombre de usuario almacenado en localStorage
let usuario = localStorage.getItem("usuario");
// Si hay un nombre de usuario, mostrarlo en la barra de navegación
if(usuario){
    document.getElementById("usuario").textContent = usuario;
}

// localStorage antes estaba en: products.js líneas 206 a 213, index.html líneas 2 a 7, 
// categories.js líneas 144 y 145, product-info.js líneas 10 a 15.

function checkLogin() {
  let isLoggedIn = sessionStorage.getItem("isLoggedIn");
  if (!isLoggedIn) {
      window.location.href = "login.html";
  }
}

window.onload = checkLogin;

// checkLogin antes estaba presente al final de cada código en los siguientes js: 
// products.js, sell.js, product-info.js (excepcionalmente se encontraba al principio), 
// my-profile.js, index.js, categories.js, cart.js.




// Cambiar entre Día y Noche
const themeSwitch = document.getElementById('themeSwitch');

// Aplicar el tema guardado al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        themeSwitch.checked = savedTheme === 'dark'; // Marca el switch si está en modo oscuro
    }
});

themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    
    // Guardar en localStorage
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    saveToLocalStorage('theme', theme);
});
