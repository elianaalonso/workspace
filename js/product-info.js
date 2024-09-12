function checkLogin() {
    let isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        window.location.href = "login.html";
    }
  }
  
  window.onload = checkLogin;

  
  document.addEventListener('DOMContentLoaded', function() {
    const productId = localStorage.getItem('selectedProductId');
    
    if (productId) {
        const apiUrl = `https://japceibal.github.io/emercado-api/products/${productId}.json`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(product => {
                document.getElementById('product-name').textContent = `${product.name}`;
                document.getElementById('product-description').textContent = `${product.description}`;
                document.getElementById('product-cost').textContent = `${product.currency} ${product.cost}`;
                document.getElementById('product-category').textContent = `${product.category}`;
                document.getElementById('product-sold-count').textContent = `${product.soldCount} vendidos`;

                const imagesContainer = document.getElementById('product-images');
                product.images.forEach(imageUrl => {
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.alt = product.name;
                    imagesContainer.appendChild(img);
                });

            })
            .catch(error => {
                console.error('Error fetching product data:', error);
            });
    } else {
        console.error('No product ID found in localStorage.');
    }
});
