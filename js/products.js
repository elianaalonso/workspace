document.addEventListener("DOMContentLoaded", function() {
  const productGrid = document.getElementById('product-grid');
  const container = productGrid.parentNode;

  // Eliminar cualquier título anterior si existe
  const existingTitle = container.querySelector('h2');
  if (existingTitle) {
    existingTitle.remove();
  }

  let productsURL = PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE;

  fetch(productsURL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Crear y agregar el nuevo título
      const title = document.createElement('h2');
      title.classList.add('text-center', 'my-4');
      title.textContent = data.catName;
      container.insertBefore(title, productGrid);

      if (Array.isArray(data.products)) {
        data.products.forEach(product => {
          // Crear la tarjeta del producto
          const productCard = document.createElement('div');
          productCard.classList.add('col-md-4', 'product-card');
          
          // Añadir identificador al contenedor del producto
          productCard.dataset.productId = product.id;

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
          price.textContent = `${product.currency} ${product.cost}`;
          productCard.appendChild(price);

          // Añadir cantidad vendida
          const soldCount = document.createElement('p');
          soldCount.classList.add('sold-count');
          soldCount.textContent = `${product.soldCount} Vendidos`;
          productCard.appendChild(soldCount);

          // Añadir la tarjeta al grid de productos
          productGrid.appendChild(productCard);

          // Agregar evento de clic para redirigir
          productCard.addEventListener('click', function() {
            localStorage.setItem("selectedProductId", product.id);
            window.location.href = 'product-info.html';
          });
        });
      } else {
        console.error('Data.products no es un array:', data.products);
      }
    })
    .catch(error => console.error('Error en la solicitud:', error));

  // Obtener el nombre de usuario almacenado en localStorage
  let usuario = localStorage.getItem("usuario");
  // Si hay un nombre de usuario, mostrarlo en la barra de navegación
  if (usuario) {
    document.getElementById("usuario").textContent = usuario;
  }
});
