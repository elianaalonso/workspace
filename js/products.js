document.addEventListener("DOMContentLoaded", function() {
  const productGrid = document.getElementById('product-grid');

  const url = 'https://japceibal.github.io/emercado-api/cats_products/101.json';

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data.products)) {
        data.products.forEach(product => {
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
        });
      } else {
        console.error('Data.products no es un array:', data.products);
      }
    })
    .catch(error => console.error('Error en la solicitud:', error));
});
