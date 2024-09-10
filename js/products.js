let productArray = [];
let productGrid = undefined;
let minPrice = undefined;
let maxPrice = undefined;
const ORDER_ASC_BY_COST = "ASC";
const ORDER_DESC_BY_COST = "DESC";
const ORDER_BY_PROD_COUNT = "COUNT";
let currentSortCriteria = ORDER_BY_PROD_COUNT;

    // se traen los datos con la función getJSONData para reutilizar el código, manejo de errores y visualizacion de carga //
document.addEventListener("DOMContentLoaded", function() {
  productGrid = document.getElementById('product-grid');
  const container = productGrid.parentNode;
 
  let productsURL=PRODUCTS_URL+localStorage.getItem("catID")+ EXT_TYPE

  getJSONData(productsURL).then(result => {
    if (result.status === 'ok') {
      if (Array.isArray(result.data.products)) {
        productArray = result.data.products;
        showProductsList();

      } else {
        console.error('Data.products no es un array:', result.data.products);
      }
    } else {
      console.error('Error en la solicitud:', result.data);
    }
  });

    // BOTÓN DE FILTRAR //
    document.getElementById("priceFilterBtn").addEventListener("click", function(){
      //se obtienen los valores ingresados por el usario
      minPrice = document.getElementById("minPrice").value;
      maxPrice = document.getElementById("maxPrice").value;

      //si el valor ingresado es válido lo convierte en número con parseINT de lo contrario queda indefinido
      if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice)) >= 0){
        minPrice = parseInt(minPrice);
      }
      else{
        minPrice = undefined;
      }

      if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice)) >= 0){
        maxPrice = parseInt(maxPrice);
      }
      else{
        maxPrice = undefined;
      }

      //se limpia el contenido actual del grid para que se muestren solo los filtrados
      productGrid.innerHTML="";
      //se llama a la función que muestra los productos filtrados
      showProductsList();
      
  });
       // BOTÓN DE LIMPIAR //
      document.getElementById('clearPriceFilter').addEventListener('click', function() {
       // se limpian los campos de min y max
       document.getElementById('minPrice').value = '';
       document.getElementById('maxPrice').value = '';
      // se restablecen los valores como indefinidos
      minPrice = undefined;
      maxPrice = undefined;
      // se limpia el grid de productos
      productGrid.innerHTML = '';
      //se llama nuevamente a mostrar todos los productos
      showProductsList();

      
});

});


// Ordenar por precio ascendente
document.getElementById("priceAsc").addEventListener("click", function(){
  currentSortCriteria = ORDER_ASC_BY_COST;
  sortAndShowCategories(currentSortCriteria);
});

// Ordenar por precio descendente
document.getElementById("priceDesc").addEventListener("click", function(){
  currentSortCriteria = ORDER_DESC_BY_COST;
  sortAndShowCategories(currentSortCriteria);
});

// Ordenar por cantidad de productos vendidos
document.getElementById("sortByPrice").addEventListener("click", function(){
  currentSortCriteria = ORDER_BY_PROD_COUNT;
  sortAndShowCategories(currentSortCriteria);
});

function sortAndShowCategories(criteria) {
let sortedArray = sortCategories(criteria, productArray);
productGrid.innerHTML = ""; // Limpiar el grid actual
showProductsList(sortedArray); // Mostrar los productos ordenados
}


 // Función que ordena los elementos segun los diferentes criterios
function sortCategories(criteria, array) {
  let result = [];

  if (criteria === ORDER_ASC_BY_COST) {
    result = array.sort(function(a, b) {
      return a.cost - b.cost;
    });
  } else if (criteria === ORDER_DESC_BY_COST) {
    result = array.sort(function(a, b) {
      return b.cost - a.cost;
    });
  } else if (criteria === ORDER_BY_PROD_COUNT) {
    result = array.sort(function(a, b) {
      let aCount = parseInt(a.soldCount);
      let bCount = parseInt(b.soldCount);

      if (aCount > bCount) return -1;
      if (aCount < bCount) return 1;
      return 0;
    });
  }

  return result;
}

    // ARMAR Y MOSTRAR LAS TARJETAS SEGÚN EL FILTRO //
function showProductsList () {
  productArray.forEach(product => {

    if (((minPrice == undefined) || (minPrice != undefined && parseInt(product.cost) >= minPrice)) && 
    ((maxPrice == undefined) || (maxPrice != undefined && parseInt(product.cost) <= maxPrice)))
      
    {
      
    // Crear la tarjeta del producto
    const productCard = document.createElement('div');
    productCard.classList.add('col-md-4', 'product-card');

    // Añadir imagen del producto
    const img = document.createElement('img');
    img.src = product.image;
    productCard.appendChild(img);

    // Añadir nombre del producto
    const name = document.createElement('h2');
    name.textContent = product.name;
    productCard.appendChild(name);

    // Añadir descripción del producto
    const description = document.createElement('p');
    description.textContent = product.description;
    productCard.appendChild(description);

    // Añadir precio del producto
    const price = document.createElement('h3');
    price.textContent = `USD ${product.cost}`;
    productCard.appendChild(price);

    // Añadir cantidad vendida
    const soldCount = document.createElement('p');
    soldCount.classList.add('sold-count');
    soldCount.textContent = `${product.soldCount} Vendidos`;
    productCard.appendChild(soldCount);

    // Añadir la tarjeta al grid de productos
    productGrid.appendChild(productCard);
    }

  });
}

    // NOMBRE DE USUARIO EN LA BARRA SUPERIOR//
//- obtener el nombre de usuario almacenado en localStorage
let usuario = localStorage.getItem("usuario");
// Si hay un nombre de usuario, mostrarlo en la barra de navegación
if(usuario){
    document.getElementById("usuario").textContent = usuario;
}

