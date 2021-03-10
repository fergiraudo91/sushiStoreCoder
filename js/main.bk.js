import sushiData from '../data/sushiData.js';
const sushiList = $('#sushiList')[0];
const carritoArr = [];
const carritoModal = document.getElementById('display-items');


let data = sushiData;

const reenderizar = () =>{
    data.forEach((el, index) => {
        const sushi = document.createElement('div');
        sushi.className = 'sushi-item';
        let opciones = '';
        el.prices.forEach(precio => {
            opciones += `<option value=${precio.unidades}-${precio.precio}>${precio.unidades} unidades - \$${precio.precio}</option>`;
        });
        sushi.innerHTML = `
            <img src='${el.img}' alt='${el.name}' />
            <div class='content'>
            <h2>${el.name}</h2>
            <h4>${el.description}</h4>
            <select>
                ${opciones}
            </select>
            <button class='btnCompra'>Agregar Al Carrito</button>
            </div>
        `;
        sushi.querySelector('button').addEventListener('click', () => {agregarItemCarrito(index)});
        sushiList.append(sushi);
    });
}


let id= 0;
const agregarItemCarrito = (index) => {
    let prices = document.querySelectorAll('select');
    let price = prices[index].value.split('-');
    const sushiItem = data[index];
    price = {
        'unidades' : price[0],
        'precio' : price[1]
    }
    let item = {
        name: sushiItem.name,
        description: sushiItem.description,
        img : sushiItem.img,
        price: price,
        type: sushiItem.type
    };
    localStorage.setItem(id, JSON.stringify(item));
    id++;
    carritoArr.push(item);
    alert(`Usted ha agregado ${data[index].name} al carrito`);
    
};

const showCarItems = () => {
    let total = 0;
    for(let i=0; i<localStorage.length; i++){
        const item = JSON.parse(localStorage.getItem(i));
        console.log(item);
        const {unidades, precio} = item.price;
        console.log(item)
        const divItem = document.createElement('div');
        divItem.className = 'carrito-item';
        divItem.innerHTML = `<div class="izquierda">
            <span>${item.name}</span>
        </div>
        <div class="derecha">
            <div class="precio">${unidades} unidades $${precio}</div><span class="trash"><i class="fas fa-trash"></i></span>
        </div>`;
        carritoModal.append(divItem);
        total+= +precio;
    }
    const divTotal = document.createElement('div');
    divTotal.className = "total-container";
    divTotal.innerHTML = `<span>Total</span> <span>$${total}</span>`;
    carritoModal.append(divTotal);
    $('#carrito-modal').css({
        "display" : "block"
    })
    
    $('#display-items').animate({
        "width": "40%"
    }, "slow");
    $('#close-button').on('click', closeCarrito);
}

const closeCarrito = () =>{
    $('#display-items').animate({
        "width": "-40%"
    }, "slow", () => {
        $('#carrito-modal').css({
            "display" : "none"
        });
        carritoModal.innerHTML = `
    <i class="fas fa-window-close close" id="close-button"></i>
    <h2 class="carrito-id">Tu Pedido</h2>`;
    });
    $('#close-button').on('click', closeCarrito);   
}

const limpiarPantalla = () => {
    sushiList.innerHTML = '';
}

const filtrarCombo = () => {
    data = sushiData.filter(el => el.type === 'combo');
    limpiarPantalla();
    reenderizar();
};

const filtrarPieza = () => {
    data = sushiData.filter(el => el.type === 'pieza');
    limpiarPantalla();
    reenderizar();
}

const filtrarEnsalada = () => {
    data = sushiData.filter(el => el.type === 'ensalada');
    limpiarPantalla();
    reenderizar();
}

const filtrarTodo = () => {
    data = sushiData;
    limpiarPantalla();
    reenderizar();
}

reenderizar();



$('#carrito').on('click', showCarItems);
$('#combo').on('click', filtrarCombo);
$('#pieza').on('click', filtrarPieza);
$('#ensalada').on('click', filtrarEnsalada);
$('#todos').on('click', filtrarTodo);
$('#close-button').on('click', closeCarrito);
