let productArray = [];
let productGrid = undefined;
let minPrice = undefined;
let maxPrice = undefined;

document.addEventListener("DOMContentLoaded", function() {
  productGrid = document.getElementById('product-grid');
  const url = 'https://japceibal.github.io/emercado-api/cats_products/101.json';
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data.products)) {
        productArray = data.products;
        showProductsList(); 
      } else {
        console.error('Data.products no es un array:', data.products);
      }
    })
    .catch(error => console.error('Error en la solicitud:', error));

    // BOTÓN DE FILTRAR //
    document.getElementById("priceFilterBtn").addEventListener("click", function(){
      
      minPrice = document.getElementById("minPrice").value;
      maxPrice = document.getElementById("maxPrice").value;

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
      productGrid.innerHTML="";

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






//- obtener el nombre de usuario almacenado en localStorage
let usuario = localStorage.getItem("usuario");
// Si hay un nombre de usuario, mostrarlo en la barra de navegación
if(usuario){
    document.getElementById("usuario").textContent = usuario;
}

