document.addEventListener("DOMContentLoaded", () => {
    const productos = JSON.parse(localStorage.getItem("cartItems")) || [];
    const listaProductos = document.getElementById("lista-productos");
    const mensajeVacio = document.getElementById("mensaje-vacio");

    if (productos.length === 0) {
        mensajeVacio.style.display = "block";
    } else {
        let subtotal = 0;
        productos.forEach((producto, index) => {
            const item = document.createElement("li");
            item.classList.add("producto-item");
            item.innerHTML = `
                <img src="${producto.image}" alt="${producto.name}" class="producto-imagen">
                <div class="producto-detalle">
                    <span class="producto-nombre">${producto.name}</span>
                    <span class="producto-precio">${producto.cost}</span>
                    <input type="number" value="${producto.cantidad}" min="1" class="producto-cantidad" data-precio="${parseFloat(producto.cost)}" data-index="${index}">
                    <button class="eliminar-producto" data-id="${producto.id}">🗑</button>
                </div>
            `;
            listaProductos.appendChild(item);
            subtotal += parseFloat(producto.cost) * producto.cantidad;
        });
        mensajeVacio.style.display = "none";
        actualizarTotales(subtotal);

        // Delegación de eventos para el botón de eliminar
        listaProductos.addEventListener("click", (e) => {
            if (e.target.classList.contains("eliminar-producto")) {
                eliminarProducto(e.target.dataset.id);
            }
        });

        // Agregar el evento de cambio en cada input de cantidad
        document.querySelectorAll(".producto-cantidad").forEach(input => {
            input.addEventListener("change", (e) => actualizarCantidad(e, productos));
        });
    }
});

// Función para actualizar la cantidad de un producto
function actualizarCantidad(event, productos) {
    const input = event.target;
    const nuevoSubtotal = parseFloat(input.value) * parseFloat(input.dataset.precio);
    const productoIndex = input.dataset.index;

    // Actualizar el subtotal visualmente
    input.nextElementSibling.innerText = `UYU ${nuevoSubtotal.toFixed(2)}`;

    // Actualizar la cantidad en el arreglo de productos y en localStorage
    productos[productoIndex].cantidad = parseInt(input.value);
    localStorage.setItem("cartItems", JSON.stringify(productos));

    // Recalcular el subtotal total y actualizar los totales
    const subtotal = productos.reduce((acc, producto) => acc + (parseFloat(producto.cost) * producto.cantidad), 0);
    actualizarTotales(subtotal);
}

// Función para actualizar los totales
function actualizarTotales(subtotal) {
    const tipoEnvio = document.querySelector('input[name="envio"]:checked').value;
    let costoEnvio = 0;

    if (tipoEnvio === "premium") costoEnvio = subtotal * 0.15;
    else if (tipoEnvio === "express") costoEnvio = subtotal * 0.07;
    else costoEnvio = subtotal * 0.05;

    document.getElementById("subtotal").innerText = `UYU ${subtotal.toFixed(2)}`;
    document.getElementById("envio").innerText = `UYU ${costoEnvio.toFixed(2)}`;
    document.getElementById("total").innerText = `UYU ${(subtotal + costoEnvio).toFixed(2)}`;
}

// Función para eliminar un producto del carrito
function eliminarProducto(id) {
    let productos = JSON.parse(localStorage.getItem("cartItems")) || [];
    const nuevosProductos = productos.filter(producto => producto.id !== id);
    localStorage.setItem("cartItems", JSON.stringify(nuevosProductos));
    
    // Actualizar la vista
    const listaProductos = document.getElementById("lista-productos");
    listaProductos.innerHTML = '';
    const mensajeVacio = document.getElementById("mensaje-vacio");
    
    if (nuevosProductos.length === 0) {
        mensajeVacio.style.display = "block";
    } else {
        mensajeVacio.style.display = "none";
        let subtotal = 0;
        nuevosProductos.forEach((producto, index) => {
            const item = document.createElement("li");
            item.classList.add("producto-item");
            item.innerHTML = `
                <img src="${producto.image}" alt="${producto.name}" class="producto-imagen">
                <div class="producto-detalle">
                    <span class="producto-nombre">${producto.name}</span>
                    <span class="producto-precio">UYU ${parseFloat(producto.cost).toFixed(2)}</span>
                    <input type="number" value="${producto.cantidad}" min="1" class="producto-cantidad" data-precio="${parseFloat(producto.cost)}" data-index="${index}">
                    <span class="producto-subtotal">UYU ${(parseFloat(producto.cost) * producto.cantidad).toFixed(2)}</span>
                    <button class="eliminar-producto" data-id="${producto.id}">🗑</button>
                </div>
            `;
            listaProductos.appendChild(item);
            subtotal += parseFloat(producto.cost) * producto.cantidad;
        });
        actualizarTotales(subtotal);
    }
}