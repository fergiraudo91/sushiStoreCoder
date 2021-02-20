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
            <button class='btnCompra'>Comprar</button>
            </div>
        `;
        sushi.querySelector('button').addEventListener('click', () => {agregarItemCarrito(index)});
        sushiList.append(sushi);
    });
}



const agregarItemCarrito = (index) => {
    carritoArr.push(sushiData[index]);
    alert(`Usted ha agregado ${sushiData[index].name}`);
    
};

const showCarItems = () => {
    console.log('Aca estoy');
    for (const item of carritoArr) {
        alert(`Usted tiene ${item.name}`);
    }
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
