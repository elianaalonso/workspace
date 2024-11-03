document.addEventListener("DOMContentLoaded", () => {
    const productos = JSON.parse(localStorage.getItem("cartItems")) || [];
    const listaProductos = document.getElementById("lista-productos");
    const mensajeVacio = document.getElementById("mensaje-vacio");
    const badge = document.querySelector('#cart-badge');
    const inputEnvio = document.querySelectorAll('input[name="envio"]');
    
    // Renderizar productos y actualizar el badge del carrito
    actualizarBadge(productos);
    if (productos.length === 0) {
        mensajeVacio.style.display = "block";
    } else {
        mensajeVacio.style.display = "none";
        renderizarProductos(productos);
    }

    // Actualizar costos de envío y totales según el tipo de envío seleccionado
    inputEnvio.forEach(radio => {
        radio.addEventListener("change", () => {
            // Actualizamos el subtotal cada vez que se cambia el tipo de envío
            convertirYActualizarSubtotal(productos);
        });
    });

    // Event listener para eliminar productos
    listaProductos.addEventListener("click", (e) => {
        if (e.target.classList.contains("eliminar-producto")) {
            eliminarProducto(e.target.dataset.id);
        }
    });
});


function actualizarBadge(productos) {
    const badge = document.querySelector('#cart-badge');
    let contador = 0;
    productos.forEach((producto) => {
        contador += producto.cantidad || 1;
    });
    badge.textContent = contador;
}

function renderizarProductos(productos) {
    const listaProductos = document.getElementById("lista-productos");
    const fragment = document.createDocumentFragment();

    productos.forEach((producto) => {
        const row = document.createElement("tr");
        const cantidadProducto = producto.cantidad || 1;
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

function actualizarCantidad(event, productos) {
    const input = event.target;
    const nuevoCantidad = parseInt(input.value);
    const productoId = input.dataset.id;

    if (isNaN(nuevoCantidad) || nuevoCantidad < 1) {
        return;
    }

    const producto = productos.find(prod => prod.id === productoId);
    if (producto) {
        producto.cantidad = nuevoCantidad;
        localStorage.setItem("cartItems", JSON.stringify(productos));

        const fila = input.closest('tr');
        const subtotalElemento = fila.querySelector('.producto-subtotal');
        const costoTexto = producto.cost.trim();
        let costo = parseFloat(costoTexto.replace("UYU", "").replace("USD", "").trim());
        const moneda = costoTexto.includes("USD") ? "USD" : "UYU";

        subtotalElemento.innerText = `${moneda} ${(costo * nuevoCantidad).toFixed(2)}`;
        convertirYActualizarSubtotal(productos);
        actualizarBadge(productos);
    }
}

const TASA_DE_CAMBIO = 42;

// Función para convertir y actualizar el subtotal a UYU, valor de envío y total
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

    // Convertimos todo el subtotal a UYU
    const subtotalEnUYU = subtotalUYU + (subtotalUSD * TASA_DE_CAMBIO);
    document.getElementById("subtotal").innerText = `UYU ${subtotalEnUYU.toLocaleString("es-UY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Determina el tipo de envío seleccionado
    const tipoEnvio = document.querySelector('input[name="envio"]:checked').value;
    let envioPorcentaje;

    // Configura el porcentaje según el tipo de envío
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

    // Calcula el valor del envío y el total
    const valorEnvio = subtotalEnUYU * envioPorcentaje;
    const total = subtotalEnUYU + valorEnvio;

    // Muestra el costo de envío y el total en la página
    document.getElementById("envio").innerText = `UYU ${valorEnvio.toLocaleString("es-UY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById("total").innerText = `UYU ${total.toLocaleString("es-UY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}


function eliminarProducto(id) {
    let productos = JSON.parse(localStorage.getItem("cartItems")) || [];
    const nuevosProductos = productos.filter(producto => producto.id !== id);

    // Actualizamos el array en localStorage
    localStorage.setItem("cartItems", JSON.stringify(nuevosProductos));
    
    // Actualizamos el badge y renderizamos nuevamente
    actualizarBadge(nuevosProductos);

    // Vaciamos y actualizamos la lista de productos en el DOM
    const listaProductos = document.getElementById("lista-productos");
    listaProductos.innerHTML = '';
    const mensajeVacio = document.getElementById("mensaje-vacio");

    if (nuevosProductos.length === 0) {
        mensajeVacio.style.display = "block";
    } else {
        mensajeVacio.style.display = "none";
        renderizarProductos(nuevosProductos);
    }

    // Actualizamos el subtotal después de eliminar el producto
    convertirYActualizarSubtotal(nuevosProductos);
}
