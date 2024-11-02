// Espera a que el documento esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    // Obtiene los productos del carrito del localStorage, o un array vacío si no hay
    const productos = JSON.parse(localStorage.getItem("cartItems")) || [];
    const listaProductos = document.getElementById("lista-productos");
    const mensajeVacio = document.getElementById("mensaje-vacio");
    const badge = document.querySelector('#cart-badge');
    const inputEnvio = document.querySelectorAll('input[name="envio"]');
    
    // Renderizar productos y actualizar el badge del carrito
    actualizarBadge(productos);

    // Si no hay productos, muestra el mensaje de vacío
    if (productos.length === 0) {
        mensajeVacio.style.display = "block";
    } else {
        mensajeVacio.style.display = "none"; // Oculta el mensaje de vacío
        renderizarProductos(productos); // Renderiza los productos al cargar
    }

    // Actualizar costos de envío y totales según el tipo de envío seleccionado
    inputEnvio.forEach(radio => {
        radio.addEventListener("change", () => {
            convertirYActualizarSubtotal(productos);
        });
    });

    // Event listener para eliminar productos
    //Delegación de eventos para el botón de eliminar
    listaProductos.addEventListener("click", (e) => {
        if (e.target.classList.contains("eliminar-producto")) {
            eliminarProducto(e.target.dataset.id); //Elimina el producto
        }
    });
});

// Actualiza el badge con la nueva cantidad de productos
function actualizarBadge(productos) {
    const badge = document.querySelector('#cart-badge');
    let contador = 0;
    productos.forEach((producto) => {
        contador += producto.cantidad || 1;
    });
    badge.textContent = contador;
}

// Función para renderizar los productos en la tabla
function renderizarProductos(productos) {
    const listaProductos = document.getElementById("lista-productos");
    const fragment = document.createDocumentFragment();

    productos.forEach((producto) => {
        const row = document.createElement("tr");
        const cantidadProducto = producto.cantidad || 1;
        
        // Detecta y convierte el costo según la moneda
        const costoTexto = producto.cost.trim();
        let costo = parseFloat(costoTexto.replace("UYU", "").replace("USD", "").trim());
        const moneda = costoTexto.includes("USD") ? "USD" : "UYU";

        row.innerHTML = `
            <td><img src="${producto.image}" alt="${producto.name}" class="producto-imagen" style="width: 100px;"></td>
            <td>${producto.name}</td>
            <td>${moneda} ${costo}</td>
            <td><input type="number" value="${cantidadProducto}" min="1" class="producto-cantidad" data-id="${producto.id}"></td>
            <td class="producto-subtotal">${moneda} ${(costo * cantidadProducto).toFixed(2)}</td>
            <td><button class="eliminar-producto" data-id="${producto.id}">🗑</button></td>
        `;

        fragment.appendChild(row);
    });

    listaProductos.innerHTML = '';
    listaProductos.appendChild(fragment);
    convertirYActualizarSubtotal(productos);

    document.querySelectorAll(".producto-cantidad").forEach(input => {
        input.addEventListener("change", (e) => actualizarCantidad(e, productos));
    });
}

// Función para actualizar la cantidad de un producto
function actualizarCantidad(event, productos) {
    const input = event.target;
    const nuevoCantidad = parseInt(input.value); // Convierte el valor a número entero
    const productoId = input.dataset.id; // Obtiene el ID del producto

    // Verifica que la cantidad sea válida
    if (isNaN(nuevoCantidad) || nuevoCantidad < 1) {
        return; // No hace nada si el valor no es válido
    }

    const producto = productos.find(prod => prod.id === productoId);
    if (producto) {
        producto.cantidad = nuevoCantidad;  // Actualiza la cantidad
        localStorage.setItem("cartItems", JSON.stringify(productos));  // Guarda los cambios en localStorage

        // Actualiza el subtotal de la fila correspondiente
        const fila = input.closest('tr');
        const subtotalElemento = fila.querySelector('.producto-subtotal');

        // Detecta la moneda del producto y calcula el subtotal correctamente
        const costoTexto = producto.cost.trim();
        let costo = parseFloat(costoTexto.replace("UYU", "").replace("USD", "").trim());
        const moneda = costoTexto.includes("USD") ? "USD" : "UYU";

        subtotalElemento.innerText = `${moneda} ${(costo * nuevoCantidad).toFixed(2)}`;
       
        // Recalcula el subtotal total y actualiza los totales
        convertirYActualizarSubtotal(productos);
        actualizarBadge(productos);
    }
}

// Tasa de cambio USD a UYU
const TASA_DE_CAMBIO = 42;  // Tasa de cambio de ejemplo, ajusta según el valor real


// Función para convertir y actualizar el subtotal a UYU
function convertirYActualizarSubtotal(productos) {
    let subtotalUYU = 0;
    let subtotalUSD = 0; 

    productos.forEach((producto) => {
        const costoTexto = producto.cost.trim();
        const cantidadProducto = producto.cantidad || 1;
        let costo = parseFloat(costoTexto.replace("UYU", "").replace("USD", "").trim());
        const moneda = costoTexto.includes("USD") ? "USD" : "UYU";

        if (moneda === "USD") {
            subtotalUSD += costo * cantidadProducto;
        } else {
            subtotalUYU += costo * cantidadProducto;
        }
    });

    const subtotalEnUYU = subtotalUYU + (subtotalUSD * TASA_DE_CAMBIO);

    // Aplica formato a UYU con separadores de miles y dos decimales
    document.getElementById("subtotal").innerText = `UYU ${subtotalEnUYU.toLocaleString("es-UY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const tipoEnvio = document.querySelector('input[name="envio"]:checked').value;
    let envioPorcentaje = tipoEnvio === "premium" ? 0.15 : tipoEnvio === "express" ? 0.07 : 0.05;
    let costoEnvio = subtotalEnUYU * envioPorcentaje;

    document.getElementById("envio").innerText = `UYU ${costoEnvio.toLocaleString("es-UY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const total = subtotalEnUYU + costoEnvio;
    document.getElementById("total").innerText = `UYU ${total.toLocaleString("es-UY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

//Función para eliminar un producto del carrito
function eliminarProducto(id) {
    let productos = JSON.parse(localStorage.getItem("cartItems")) || [];
    const nuevosProductos = productos.filter(producto => producto.id !== id);
    localStorage.setItem("cartItems", JSON.stringify(nuevosProductos));
    actualizarBadge(nuevosProductos);

    //Actualiza la vista
    const listaProductos = document.getElementById("lista-productos");
    listaProductos.innerHTML = ''; // Limpia la lista actual
    const mensajeVacio = document.getElementById("mensaje-vacio");

    if (nuevosProductos.length === 0) {
        mensajeVacio.style.display = "block";  // Muestra el mensaje de vacío
    } else {
        mensajeVacio.style.display = "none"; // Oculta el mensaje de vacío
        renderizarProductos(nuevosProductos); // Renderiza los nuevos productos
    }
}
