// Espera a que el documento HTML esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
    // Recupera los productos del carrito desde localStorage, o un array vacío si no hay productos
    const productos = JSON.parse(localStorage.getItem("cartItems")) || [];
    const listaProductos = document.getElementById("lista-productos"); // Elemento donde se mostrarán los productos
    const mensajeVacio = document.getElementById("mensaje-vacio"); // Elemento para el mensaje de carrito vacío
    const badge = document.querySelector('#cart-badge'); // Badge para mostrar la cantidad total de productos en el carrito
    const inputEnvio = document.querySelectorAll('input[name="envio"]'); // Opciones de tipo de envío

    // Renderiza productos en el carrito y actualiza el badge del carrito
    actualizarBadge(productos);
    if (productos.length === 0) {
        // Si el carrito está vacío, muestra el mensaje de "carrito vacío"
        mensajeVacio.style.display = "block";
    } else {
        // Si hay productos, oculta el mensaje y renderiza los productos
        mensajeVacio.style.display = "none";
        renderizarProductos(productos);
    }

    // Añade un event listener a cada opción de envío para actualizar el subtotal al seleccionar un tipo de envío
    inputEnvio.forEach(radio => {
        radio.addEventListener("change", () => {
            // Actualiza el subtotal cada vez que se cambia el tipo de envío
            convertirYActualizarSubtotal(productos);
        });
    });

    // Event listener para el botón de eliminar productos
    listaProductos.addEventListener("click", (e) => {
        if (e.target.classList.contains("eliminar-producto")) {
            // Elimina el producto usando el ID almacenado en data-id
            eliminarProducto(e.target.dataset.id);
        }
    });
});


// Función para actualizar el badge del carrito con la cantidad total de productos
function actualizarBadge(productos) {
    const badge = document.querySelector('#cart-badge');
    let contador = 0;
    productos.forEach((producto) => {
        // Cuenta la cantidad de cada producto en el carrito
        contador += producto.cantidad || 1;
    });
    badge.textContent = contador; // Muestra el total en el badge
}

// Función para renderizar los productos en el carrito
function renderizarProductos(productos) {
    const listaProductos = document.getElementById("lista-productos");
    const fragment = document.createDocumentFragment(); // Fragmento para evitar reflujo en el DOM

    productos.forEach((producto) => {
        const row = document.createElement("tr"); // Crea una fila para cada producto
        const cantidadProducto = producto.cantidad || 1;
        const costoTexto = producto.cost.trim();
        let costo = parseFloat(costoTexto.replace("UYU", "").replace("USD", "").trim()); // Elimina moneda y espacios
        const moneda = costoTexto.includes("USD") ? "USD" : "UYU"; // Determina la moneda

        // Genera el HTML para la fila del producto, incluyendo imagen, nombre, costo, cantidad, subtotal y botón eliminar
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

    listaProductos.innerHTML = ''; // Vacía la lista antes de añadir el nuevo contenido
    listaProductos.appendChild(fragment); // Añade el fragmento con los productos
    convertirYActualizarSubtotal(productos); // Calcula y muestra el subtotal y total

    // Agrega un event listener para actualizar la cantidad de cada producto
    document.querySelectorAll(".producto-cantidad").forEach(input => {
        input.addEventListener("change", (e) => actualizarCantidad(e, productos));
    });
}

// Función para actualizar la cantidad de un producto
function actualizarCantidad(event, productos) {
    const input = event.target;
    const nuevoCantidad = parseInt(input.value);
    const productoId = input.dataset.id;

    if (isNaN(nuevoCantidad) || nuevoCantidad < 1) {
        return; // Evita cantidades no válidas
    }

    const producto = productos.find(prod => prod.id === productoId);
    if (producto) {
        producto.cantidad = nuevoCantidad; // Actualiza la cantidad en el producto
        localStorage.setItem("cartItems", JSON.stringify(productos)); // Guarda en localStorage

        const fila = input.closest('tr');
        const subtotalElemento = fila.querySelector('.producto-subtotal');
        const costoTexto = producto.cost.trim();
        let costo = parseFloat(costoTexto.replace("UYU", "").replace("USD", "").trim());
        const moneda = costoTexto.includes("USD") ? "USD" : "UYU";

        // Actualiza el subtotal para el producto en la interfaz
        subtotalElemento.innerText = `${moneda} ${(costo * nuevoCantidad).toFixed(2)}`;
        convertirYActualizarSubtotal(productos); // Actualiza el subtotal general
        actualizarBadge(productos); // Actualiza el badge del carrito
    }
}

const TASA_DE_CAMBIO = 42; // Tasa de cambio para conversión de USD a UYU

// Función para convertir y actualizar el subtotal, el valor de envío y el total
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

    // Convierte el subtotal en USD a UYU y suma ambos para obtener el subtotal total en UYU
    const subtotalEnUYU = subtotalUYU + (subtotalUSD * TASA_DE_CAMBIO);
    document.getElementById("subtotal").innerText = `UYU ${subtotalEnUYU.toLocaleString("es-UY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Determina el tipo de envío seleccionado y establece el porcentaje correspondiente
    const tipoEnvio = document.querySelector('input[name="envio"]:checked').value;
    let envioPorcentaje;

    switch (tipoEnvio) {
        case "premium":
            envioPorcentaje = 0.15;
            break;
        case "express":
            envioPorcentaje = 0.07;
            break;
        case "standard":
            envioPorcentaje = 0.05;
            break;
        default:
            envioPorcentaje = 0;
    }

    // Calcula el valor de envío y el total (subtotal + envío)
    const valorEnvio = subtotalEnUYU * envioPorcentaje;
    const total = subtotalEnUYU + valorEnvio;

    // Muestra los costos de envío y el total en la interfaz
    document.getElementById("envio").innerText = `UYU ${valorEnvio.toLocaleString("es-UY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById("total").innerText = `UYU ${total.toLocaleString("es-UY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Función para eliminar un producto del carrito
function eliminarProducto(id) {
    let productos = JSON.parse(localStorage.getItem("cartItems")) || [];
    const nuevosProductos = productos.filter(producto => producto.id !== id); // Filtra el producto eliminado

    // Guarda el nuevo array de productos en localStorage
    localStorage.setItem("cartItems", JSON.stringify(nuevosProductos));

    // Actualiza el badge y vuelve a renderizar el carrito
    actualizarBadge(nuevosProductos);

    // Actualiza el DOM para mostrar el nuevo contenido o el mensaje de carrito vacío
    const listaProductos = document.getElementById("lista-productos");
    listaProductos.innerHTML = '';
    const mensajeVacio = document.getElementById("mensaje-vacio");

    if (nuevosProductos.length === 0) {
        mensajeVacio.style.display = "block";
    } else {
        mensajeVacio.style.display = "none";
        renderizarProductos(nuevosProductos);
    }

    // Actualiza el subtotal y el costo de envío después de eliminar el producto
    convertirYActualizarSubtotal(nuevosProductos);
}
