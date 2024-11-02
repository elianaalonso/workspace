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
        renderizarProductos(productos); // Renderiza los productos al cargar
    }

    // Delegación de eventos para el botón de eliminar
    listaProductos.addEventListener("click", (e) => {
        if (e.target.classList.contains("eliminar-producto")) {
            eliminarProducto(e.target.dataset.id); // Elimina el producto
        }
    });
});

// Función para renderizar los productos en la tabla
function renderizarProductos(productos) {
    const listaProductos = document.getElementById("lista-productos");
    const fragment = document.createDocumentFragment();
    let subtotal = 0; // Inicializa el subtotal

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
            <td>
                <input type="number" value="${cantidadProducto}" min="1" class="producto-cantidad" data-id="${producto.id}">
            </td>
            <td class="producto-subtotal">${moneda} ${(costo * cantidadProducto).toFixed(2)}</td>
            <td><button class="eliminar-producto" data-id="${producto.id}">🗑</button></td>
        `;

        fragment.appendChild(row);
        subtotal += costo * cantidadProducto; // Suma al subtotal
    });

    listaProductos.innerHTML = '';
    listaProductos.appendChild(fragment);

    // Llama a la función para convertir y actualizar el subtotal en UYU
    convertirYActualizarSubtotal(productos);

    // Agrega el evento de cambio en cada input de cantidad
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
        producto.cantidad = nuevoCantidad; // Actualiza la cantidad
        localStorage.setItem("cartItems", JSON.stringify(productos)); // Guarda los cambios en localStorage

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
    }
}

// Tasa de cambio USD a UYU
const TASA_DE_CAMBIO = 42; // Tasa de cambio de ejemplo, ajusta según el valor real

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
        renderizarProductos(nuevosProductos); // Renderiza los nuevos productos
    }
}

// Función para agregar productos al carrito (debe llamarse cuando se agrega un producto)
function agregarProductoAlCarrito(nuevoProducto) {
    let productos = JSON.parse(localStorage.getItem("cartItems")) || [];
    const productoExistente = productos.find(prod => prod.id === nuevoProducto.id);

    if (productoExistente) {
        // Si el producto ya existe, solo actualiza la cantidad
        productoExistente.cantidad += nuevoProducto.cantidad; // Aumenta la cantidad
    } else {
        // Si no existe, lo agrega al carrito
        nuevoProducto.cantidad = nuevoProducto.cantidad || 1; // Asegúrate de que la cantidad inicial sea 1
        productos.push(nuevoProducto);
    }

    localStorage.setItem("cartItems", JSON.stringify(productos)); // Guarda los cambios en localStorage

    // Renderiza los productos después de agregar
    renderizarProductos(productos); // Renderiza la lista actualizada
}
