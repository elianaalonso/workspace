

  
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
                document.getElementById('product-route').textContent = `${product.name}`;

                const largeImage = document.querySelector('#large-image img');
                const thumbnailsContainer = document.querySelector('.thumbnails');
                let images = product.images;

                if (images.length > 0) {
                    largeImage.src = images[0]; 
                    images.forEach((imageUrl, index) => {
                        const thumbnail = document.createElement('img');
                        thumbnail.src = imageUrl;
                        thumbnail.alt = `Thumbnail ${index}`;
                        thumbnail.addEventListener('click', () => {
                            largeImage.src = imageUrl;
                        });
                        thumbnailsContainer.appendChild(thumbnail);
                    });
                };               

                const body = document.body;
                switch(product.category) {
                    case 'Autos':
                        body.style.backgroundImage = 'url("img/cat101_1.jpg")';
                        break;
                    case 'Juguetes':
                        body.style.backgroundImage = 'url("img/cat102_1.jpg")';
                        break;
                    case 'Muebles':
                        body.style.backgroundImage = 'url("img/cat103_1.jpg")';
                        break;
                    case 'Herramientas':
                        body.style.backgroundImage = 'url("img/cat104_1.jpg")';
                        break;
                    case 'Computadoras':
                        body.style.backgroundImage = 'url("img/cat105_1.jpg")';
                        break;
                    case 'Vestimenta':
                        body.style.backgroundImage = 'url("img/cat106_1.jpg")';
                        break;
                    case 'Electrodomésticos':
                        body.style.backgroundImage = 'url("img/cat107_1.jpg")';
                        break;
                    case 'Deporte':
                        body.style.backgroundImage = 'url("img/cat108_1.jpg")';
                        break;
                    case 'Celulares':
                        body.style.backgroundImage = 'url("img/cat109_1.jpg")';
                        break;           
                }


                let currentIndex = 0;
                const nextButton = document.getElementById('next-btn');
                const prevButton = document.getElementById('prev-btn');

                function updateCarousel() {
                    largeImage.src = images[currentIndex];
                    thumbnailsContainer.querySelectorAll('img').forEach((img, index) => {
                        img.style.opacity = (index === currentIndex) ? 1 : 0.5;
                    });
                }

                nextButton.addEventListener('click', () => {
                    currentIndex = (currentIndex + 1) % images.length;
                    updateCarousel();
                });

                prevButton.addEventListener('click', () => {
                    currentIndex = (currentIndex - 1 + images.length) % images.length;
                    updateCarousel();
                });

            })
            .catch(error => {
                console.error('Error fetching product data:', error);
            });
    } else {
        console.error('No product ID found in localStorage.');
    }
});
