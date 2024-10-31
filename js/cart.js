// Espera a que el documento esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    // Obtiene los productos del carrito del localStorage, o un array vacío si no hay
    const productos = JSON.parse(localStorage.getItem("cartItems")) || [];
    const listaProductos = document.getElementById("lista-productos");
    const mensajeVacio = document.getElementById("mensaje-vacio");

    // Si no hay productos, muestra el mensaje de vacío
    if (productos.length === 0) {
        mensajeVacio.style.display = "block";
    } else {
        mensajeVacio.style.display = "none"; // Oculta el mensaje de vacío

        let subtotal = 0;

        productos.forEach((producto) => {
            const cantidadProducto = producto.cantidad || 1;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${producto.image}" alt="${producto.name}" class="producto-imagen" style="width: 100px;"></td>
                <td>${producto.name}</td>
                <td>${producto.cost}</td>
                <td>
                    <input type="number" value="${cantidadProducto}" min="1" class="producto-cantidad" data-id="${producto.id}">
                </td>
                <td class="producto-subtotal">${producto.cost}</td>
                <td><button class="eliminar-producto" data-id="${producto.id}">🗑</button></td>
            `;
            listaProductos.appendChild(row);
            subtotal += parseFloat(producto.cost) * cantidadProducto;
        });

        // Actualiza totales al final
        actualizarTotales(subtotal); // Llama a la función para actualizar los totales

        // Delegación de eventos para el botón de eliminar
        listaProductos.addEventListener("click", (e) => {
            if (e.target.classList.contains("eliminar-producto")) {
                eliminarProducto(e.target.dataset.id); // Elimina el producto
            }
        });

        // Agrega el evento de cambio en cada input de cantidad
        document.querySelectorAll(".producto-cantidad").forEach(input => {
            input.addEventListener("change", (e) => actualizarCantidad(e, productos));
        });
    }
});

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
        producto.cantidad = nuevoCantidad; // Actualiza la cantidad
    }
    localStorage.setItem("cartItems", JSON.stringify(productos)); // Guarda los cambios en localStorage

    // Recalcula el subtotal total y actualiza los totales
    const subtotal = productos.reduce((acc, producto) => acc + (parseFloat(producto.cost) * producto.cantidad), 0);
    actualizarTotales(subtotal); // Actualiza los totales
}

// Función para actualizar los totales
function actualizarTotales(subtotal) {
    // Aquí puedes calcular y mostrar el total, incluyendo envío si es necesario
    document.getElementById("subtotal").innerText = `UYU ${subtotal.toFixed(2)}`;
    // Si tienes lógica de envío, inclúyela aquí
}

// Función para eliminar un producto del carrito
function eliminarProducto(id) {
    let productos = JSON.parse(localStorage.getItem("cartItems")) || [];
    const nuevosProductos = productos.filter(producto => producto.id !== id); // Filtra el producto a eliminar
    localStorage.setItem("cartItems", JSON.stringify(nuevosProductos)); // Guarda los cambios en localStorage

    // Actualiza la vista
    const listaProductos = document.getElementById("lista-productos");
    listaProductos.innerHTML = ''; // Limpia la lista actual
    const mensajeVacio = document.getElementById("mensaje-vacio");

    if (nuevosProductos.length === 0) {
        mensajeVacio.style.display = "block"; // Muestra el mensaje de vacío
    } else {
        mensajeVacio.style.display = "none"; // Oculta el mensaje de vacío
        let subtotal = 0;

        // Renderiza los nuevos productos
        nuevosProductos.forEach((producto) => {
            const cantidadProducto = producto.cantidad || 1;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${producto.image}" alt="${producto.name}" class="producto-imagen" style="width: 100px;"></td>
                <td>${producto.name}</td>
                <td>UYU ${producto.cost}</td>
                <td>
                    <input type="number" value="${cantidadProducto}" min="1" class="producto-cantidad" data-id="${producto.id}">
                </td>
                <td class="producto-subtotal">${producto.cost}</td>
                <td><button class="eliminar-producto" data-id="${producto.id}">🗑</button></td>
            `;
            listaProductos.appendChild(row);
            subtotal += producto.cost * cantidadProducto; // Calcula el subtotal
        });
        actualizarTotales(subtotal); // Actualiza los totales
    }
}