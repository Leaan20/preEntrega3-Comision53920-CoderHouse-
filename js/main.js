// Colección de productos

class trajeNeoprene {
    constructor(id, nombre, marca, grosor, precio, talle = [], img) {
        this.id = id;
        this.nombre = nombre;
        this.marca = marca;
        this.grosor = grosor;
        this.precio = precio;
        this.talle = talle;
        this.img = img;
    }
}

const inventario = [
    new trajeNeoprene(1, "Revolution", "Billabong", "4/3", 250000, ["s", "m"], "./asets/img/neoprene-billa-1.png"),
    new trajeNeoprene(2, "Plus", "Hurley", "4/3", 280000, ["m", "l", "xl"], "./asets/img/neoprene-hurley-1.png"),
    new trajeNeoprene(3, "E-bomb", "Rip curl", "4/3", 300000, ["s", "m", "xl"], "./asets/img/neoprene-rip-1.jpg"),
    new trajeNeoprene(4, "Flashbomb", "Rip curl", "4/3", 420000, ["s", "l", "xl"], "./asets/img/neoprene-rip-2.png"),
    new trajeNeoprene(5, "Highline", "Quiksilver", "4/3", 280000, ["s", "m", "l"], "./asets/img/neoprene-quik-1.png"),
    new trajeNeoprene(6, "Marathon", "Quiksilver", "4/3", 250000, ["s", "m", "xl"], "./asets/img/neoprene-quik-2.png"),
    new trajeNeoprene(7, "High Seas", "Vissla", "4/3", 350000, ["s", "l", "xl"], "./asets/img/neoprene-vissla-1.png"),
    new trajeNeoprene(8, "Seas Comp", "Vissla", "4/3", 290000, ["m", "l", "xl"], "./asets/img/neoprene-vissla-2.png")
];

// ------------- Variables que vamos a utilizar ------------
const stock = [];
let carrito = [];
const search = "";
const inputs = document.querySelectorAll('input');
const barraSearch = inputs[0];
const btnSearch = document.querySelector('#btnSearch');
const checks = document.querySelectorAll('input.check');
const cardContainer = document.querySelector('#cardContainer');
const btnFinalizarCompra = document.querySelector('#btnFinalizarCompra');
const btnVaciar = document.querySelector('#btnVaciar');
let carritoContainer = document.querySelector('#carritoContainer');

//----------------- Funciones -----------------------

// Función que carga el inventario al stock
function cargaStock(arr) {
    for (const el of arr) {
        stock.push(el);
    }
}

// Función de búsqueda por filtrado genérica
function filtrar(arr, filtro, param) {
    return arr.filter((el) => {
        if (param == "precio") {
            return el.precio <= parseFloat(filtro);
        } else {
            return el[`${param}`].includes(filtro);
        }
    });
}

//funcion de busqueda
function busqueda(arr, filtro) {
    const encontrado = arr.find((el) => {
        return el.nombre.includes(filtro);
    });
    return encontrado;
}

//funcion que mantenga la primer letra en mayuscula y sea mas facil coincidir con la bsuqueda
function inicioMayus(palabra) {
    palabra = palabra.toLowerCase();

    inicial = palabra[0].toUpperCase();
    resto = palabra.slice(1);

    palabraFinal = inicial + resto;

    return palabraFinal;
}

// Función constructora de cards
function crearHtml(arr) {
    cardContainer.innerHTML = "";
    if (Array.isArray(arr)) {
        arr.forEach(el => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="${el.img}" alt="${el.nombre}">
                <hr>
                <p>${el.marca}</p>
                <h3>${el.nombre}</h3>
                <p>Precio: $${el.precio}</p>
                <div class="card-action">
                    <button class="btn btnAgregar" data-id="${el.id}">Agregar</button>
                </div>
            `;
            cardContainer.appendChild(card);
        });
    } else {
        console.error("El argumento dado no es un array.");
    }
}

//Funcion para que guarde los datos en el local Storage
function guardarLS(key, prod) {
    localStorage.setItem(key, JSON.stringify(prod));
}

// para que siga apareciendo la info del carrito desde el Local Storage cuando se cargue la pagina
window.addEventListener('DOMContentLoaded', () => {
    let carritoLS = JSON.parse(localStorage.getItem('carrito'));
    if (carritoLS) {
        carrito = carritoLS;
        actualizarCarrito();
    }
});


//funcion que determina si corresponde el valor de envio o no
const costoEnvio = (total) => {
    return total >= 280000 ? 0 : 3400;
};

//Funcion que totalice el carrito
function totalizar(arr) {
    const total = arr.reduce((acc, el) => acc + (el.precio * el.cantidad), 0);
    return total + costoEnvio(total);
}

// Función para actualizar la vista del carrito
function actualizarCarrito() {
    carritoContainer.innerHTML = '';
    if (carrito.length === 0) {
        const carritoVacio = document.createElement('p');
        carritoVacio.textContent = 'Tu carrito está vacío.';
        carritoContainer.appendChild(carritoVacio);
    } else {
        carrito.forEach(producto => {
            const productItem = document.createElement('div');
            productItem.classList.add('carrito-item');
            productItem.innerHTML = `
                <img src="${producto.img}" class="imgCarrito" alt="${producto.nombre}">
                <span>${producto.nombre}</span>
                <span>Precio: $${producto.precio}</span>
                <span>Cantidad: ${producto.cantidad}</span>
                <button class="btn btn-secondary btnEliminar" data-id="${producto.id}">Eliminar</button>
            `;
            carritoContainer.appendChild(productItem);
        });
    }
}

// agregar los productos al carrito
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('btnAgregar')) {
        const productId = event.target.getAttribute('data-id');
        const productToAdd = stock.find(product => product.id === parseInt(productId));
        if (productToAdd) {
            const existingProductIndex = carrito.findIndex(product => product.id === parseInt(productId));
            if (existingProductIndex !== -1) {
                carrito[existingProductIndex].cantidad++;
                guardarLS('carrito', carrito);
                actualizarCarrito();
            } else {
                productToAdd.cantidad = 1;
                carrito.push(productToAdd);
                guardarLS('carrito', carrito);
                actualizarCarrito();
            }
        }
    }
});

//Finalizar la compra
btnFinalizarCompra.addEventListener('click', () => {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío");
    } else {
        const totalCompra = totalizar(carrito);
        alert(`El total de tu compra es: $${totalCompra}`);
        if (costoEnvio(totalCompra) === 0) {
            alert("Tenes envío gratis!");
        }
        carrito = [];
        limpiarLocalStorage();
        actualizarCarrito();
    }
});

//Eliminamos lo almacenado.
function limpiarLocalStorage() {
    localStorage.removeItem('carrito');
    carritoContainer.innerHTML = '';
}

//Para eliminar productos individuales del carrito
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('btnEliminar')) {
        const productId = event.target.getAttribute('data-id');
        eliminarProducto(parseInt(productId));
    }
});

//Vaciar el carrito
btnVaciar.addEventListener('click', () => {
    carrito.length = 0;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarrito();
});

//Funcion que elimina productos del carrito
function eliminarProducto(id) {
    const index = carrito.findIndex(producto => producto.id === id);
    if (index !== -1) {
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarrito();
    }
}

//Para poder utilizar filtro al buscar.
for (const check of checks) {
    check.addEventListener('change', () => {
        if (check.checked) {
            btnSearch.addEventListener('click', () => {
                filtros = filtrar(stock, inicioMayus(barraSearch.value), check.value);
                console.log(filtros);
                crearHtml(filtros);
            });
        }
    });
}

//Cargamos el stock en el inventario
cargaStock(inventario);
