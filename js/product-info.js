function checkLogin() {
    let isLoggedIn = sessionStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
        window.location.href = "login.html";
    }
  }
  
  window.onload = checkLogin;

  //- obtener el nombre de usuario almacenado en localStorage
  let usuario = localStorage.getItem("usuario");
  // Si hay un nombre de usuario, mostrarlo en la barra de navegación
  if(usuario){
      document.getElementById("usuario").textContent = usuario;
  }

  
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

document.addEventListener('DOMContentLoaded', function() {
    const productId = localStorage.getItem('selectedProductId'); // Obtener el ID del producto seleccionado
    const apicommentsUrl = `https://japceibal.github.io/emercado-api/products_comments/${productId}.json`; // URL de la API

    fetch(apicommentsUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(comments => {
            const commentsContainer = document.getElementById('comments-container');

            // Iterar sobre cada comentario y crearlos en el DOM
            comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment');

                // Crea las estrellas basadas en la calificación
                const stars = Array.from({ length: 5 }, (_, index) => {
                    return index < comment.score ? '★' : '☆';
                }).join('');

                commentDiv.innerHTML = `
                    <h3>${comment.user}</h3>
                    <div class="stars">${stars}</div>
                    <p>${comment.description}</p>
                    <div class="date">${new Date(comment.dateTime).toLocaleString()}</div>
                `;

                commentsContainer.appendChild(commentDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
            const commentsContainer = document.getElementById('comments-container');
            commentsContainer.innerHTML = '<p>No se pudieron cargar los comentarios.</p>';
        });
});
