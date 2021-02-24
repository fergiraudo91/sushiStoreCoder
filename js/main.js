import sushiData from '../data/sushiData.js';
const sushiList = document.getElementById('sushiList');
const carrito = document.getElementById('carrito');
const carritoArr = [];
const comboFilter = document.getElementById('combo');
const piezaFilter = document.getElementById('pieza');
const ensaladaFilter = document.getElementById('ensalada');
const todoFilter = document.getElementById('todos');

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
        const {unidades, precio} = item.price;
        alert(`Usted ha comprado ${unidades} unidades de ${item.name} con un precio de  ${precio}`);
        total+= +precio;
    }
    alert(`El precio total es de $${total}`);    
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



carrito.addEventListener('click', showCarItems);
comboFilter.addEventListener('click', filtrarCombo);
piezaFilter.addEventListener('click', filtrarPieza);
ensaladaFilter.addEventListener('click', filtrarEnsalada);
todoFilter.addEventListener('click', filtrarTodo);
