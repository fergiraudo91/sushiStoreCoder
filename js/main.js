const phoneCar = document.getElementById('car-phone');
//Selecciono el elemento del DOM donde se van a cargar todos los items disponibles
const sushiList = $("#sushiList")[0];
//Se establece un array con los items de compra que esten en el DOM, en el caso de no estar se crea un array vacío
let carritoArr = JSON.parse(localStorage.getItem("compra")) || [];
//Se selecciona los elementos del carrito en el DOM
const carritoModal = document.getElementById("display-items");
//Se crea una variable de cantidad de veces que se abrio el carrito para controlar apertura y cierre del mismo cuando utilicen el botón carrito, en caso de que sea par se abre y en
//caso de que sea impar se cierra
let carrTimes = 0;

//Esta función obtiene los datos de un JSON de forma asíncrona
const getDataByJson = async (url) => {
  const data = await fetch(url);
  const response = await data.json();
  return response;
};

//Esta función se encarga de reenderizar los ítems en pantalla
const reenderizar = async (data) => {
  data.forEach((el) => {
    const sushi = document.createElement("div");
    sushi.className = "sushi-item";
    let opciones = "";
    el.prices.forEach((precio) => {
      opciones += `<option value=${precio.unidades}-${precio.precio}>${precio.unidades} unidades - \$${precio.precio}</option>`;
    });
    sushi.innerHTML = `
            <img src='${el.img}' alt='${el.name}' />
            <div class='content'>
            <h2>${el.name}</h2>
            <h4>${el.description}</h4>
            <select id="selection${el.id}">
                ${opciones}
            </select>
            <button class='btnCompra'>Agregar Al Carrito</button>
            </div>
        `;

    sushiList.append(sushi);
    $(".sushi-item").hide();
    $(".sushi-item").fadeIn("slow");
    const select = document.getElementById(`selection${el.id}`);
    sushi.querySelector("button").addEventListener("click", () => {
      agregarItemCarrito(el, select.value);
    });
  });
};

//Esta función agrega items al carrito y al localStorage eliminando los precios del item para agregar el seleccionado por el usuario
//Esto se debe a que cada item tiene varios precios y solo queremos el precio que selecciono el usuario
const agregarItemCarrito = (item, price) => {
  delete item.prices;
  price = price.split("-");
  price = {
    cantidad: price[0],
    precio: price[1],
  };
  item.price = price;
  carritoArr.push(item);
  localStorage.setItem("compra", JSON.stringify(carritoArr));
  alert(`${item.name} se ha agregado correctamente al carrito`);
};

//Esta función abre el carrito con una animación y renderiza todos los items
const openCar = (items, width) => {
  let total = 0;
  carritoModal.innerHTML = `
    <i class="fas fa-window-close close" id="close-button"></i>
    <h2 class="carrito-id">Tu Pedido</h2>
  `;
  $("#close-button").on("click", closeCarrito);
  for (let i = 0; i < items.length; i++) {
    const { cantidad, precio } = items[i].price;
    const divItem = document.createElement("div");
    divItem.className = "carrito-item";
    divItem.innerHTML = `<div class="izquierda">
                    <span>${items[i].name}</span>
                </div>
                <div class="centro">
                    <div class="precio">${cantidad} unidades $${precio}</div>
                </div>
                <div class="derecha" id="trash-${items[i].id}"><span class="trash"><i class="fas fa-trash"></i></span></div>`;
    carritoModal.append(divItem);
    total += +precio;
    const trashItem = document.getElementById(`trash-${items[i].id}`);
    trashItem.addEventListener("click", () => {
      deleteItem(items[i].id);
    });
  }
  const divTotal = document.createElement("div");
  divTotal.className = "total-container";
  divTotal.innerHTML = `<span>Total</span> <span>$${total}</span> <div class="buy"><button class="btn-buy" id="btn-buy">Comprar</button></div>`;
  carritoModal.append(divTotal);
  $("#carrito-modal").css({
    display: "block",
  });
  $('#btn-buy').on('click', () => {buyItems(items, total)});

  $("#display-items").animate(
    {
      width: `${width}%`,
    },
    "slow"
  );
  carrTimes++;
};

//Esta función reenderiza el formulario para que el usuario cargue su información
const setBuyForm = () => {
  carritoModal.innerHTML = `
    <i class="fas fa-window-close close" id="close-button"></i>
    <form class="buy-form" id="buy-form" name="buyForm">
    <div class="form-group">
      <label for="inputName">Nombre</label>
      <input type="text" class="form-control" id="inputName" required>
    </div>
    <div class="form-group">
      <label for="surname">Apellido</label>
      <input type="text" class="form-control" id="surname" required>
    </div>
    <div class="form-group">
      <label for="address">Dirección</label>
      <input type="text" class="form-control" id="address" required>
    </div>
    <div class="form-group">
      <label for="payment">Forma de pago</label>
    <select class="form-control" id="payment">
      <option>Efectivo</option>
      <option>Mercado Pago</option>
      <option>Tarjetas</option>
    </select>
  </div>
    <button type="submit" class="btn btn-dark">Comprar</button>
  </form>`;
}

//Esta función simula la carga de los elementos a través de una pequeña animación de 3 segundos
//Luego renderiza nuevamente el formulario y finalmente los datos confirmados
const buyItems = (items, total) => {
  if(total === 0){
    closeCarrito();
    return;
  }
  const loader = document.createElement('div');
  loader.className = 'loader-container';
  loader.innerHTML = '<div class="loader"></div><div class="loader2"></div>';
  carritoModal.innerHTML = '';
  carritoModal.append(loader);
  setTimeout(() => {
    setBuyForm();
  $('#close-button').on('click', closeCarrito);
  $('#buy-form').on('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('inputName').value;
    const surname = document.getElementById('surname').value;
    const direccion = document.getElementById('address').value;
    const payment = document.getElementById('payment').value;
    carritoModal.innerHTML = '';
    carritoModal.append(loader);
    setTimeout(() => {
      carritoModal.innerHTML = '';
      const buyDiv = document.createElement('div');
      buyDiv.className = 'pedido';
      buyDiv.innerHTML = `<i class="fas fa-window-close close" id="close-button"></i>
      <h2>Su pedido ha sido registrado</h2>
        <p>Número de orden: ${Math.floor(Math.random() * 1000)}</p>
        <p>Nombre: ${name}</p>
        <p>Apellido: ${surname}</p>
        <h2>Items:</h2>
      `;
      for(let i=0; i<items.length; i++){
        const item = document.createElement('p');
        const {cantidad, precio} = items[i].price;
        item.innerHTML = `${cantidad} ${items[i].name} - ${precio}`;
        buyDiv.append(item);
      }
      const totalDiv = document.createElement('div');
      totalDiv.className = 'total-div';
      totalDiv.innerHTML = `<h2>Total:</h2>
        <p>$${total}</p>
        </div>
      `;
      buyDiv.append(totalDiv);
      carritoModal.append(buyDiv);
      $('#close-button').on('click', closeCarrito);
      carritoArr = [];
      localStorage.removeItem('compra');
    }, 3000);
  });
  }, 3000);
};

//Esta función se utiliza para eliminar un ítem del carritoa través del ID
const deleteItem = (id) => {
  const option = confirm(
    "¿Está seguro que quiere eliminar el item seleccionado?"
  );
  if (option) {
    const newCarr = carritoArr.filter((el) => el.id !== id);
    carritoArr = newCarr;
    localStorage.setItem("compra", JSON.stringify(carritoArr));
    openCar(carritoArr);
  }
};

//Con esta función verifico si el carrito se ha presionado un numero par o impar de veces para precisar si se abre o se cierra
const showCarItems = (width = 40) => {
  const items = JSON.parse(localStorage.getItem("compra")) || [];
  if (carrTimes % 2 == 0) {
    openCar(items, width);
  } else {
    closeCarrito();
  }
  $("#close-button").on("click", closeCarrito);
};

//Esta función cierra el carrito a través de una animación y sobreescribe su contenido para cuando se vuelva abrir
const closeCarrito = () => {
  carrTimes++;
  $("#display-items").animate(
    {
      width: "-40%",
    },
    "slow",
    () => {
      $("#carrito-modal").css({
        display: "none",
      });
      carritoModal.innerHTML = `
    <i class="fas fa-window-close close" id="close-button"></i>
    <h2 class="carrito-id">Tu Pedido</h2>`;
    }
  );
  $("#close-button").on("click", closeCarrito);
};

//Esta función limpia los elementos del DOM de la lista de sushi
const limpiarPantalla = () => {
  sushiList.innerHTML = "";
};

//Esta función es para filtrar por combos
const filtrarCombo = async () => {
  const dataFetch = await fetch("data/sushiData.json");
  const response = await dataFetch.json();
  const data = response.filter((el) => el.type === "combo");
  limpiarPantalla();
  reenderizar(data);
};

//Esta función es para filtrar por piezas
const filtrarPieza = async () => {
  const dataFetch = await fetch("data/sushiData.json");
  const response = await dataFetch.json();
  const data = response.filter((el) => el.type === "pieza");
  limpiarPantalla();
  reenderizar(data);
};
//Esta función es para filtrar por ensaladas
const filtrarEnsalada = async () => {
  const dataFetch = await fetch("data/sushiData.json");
  const response = await dataFetch.json();
  const data = response.filter((el) => el.type === "ensalada");
  limpiarPantalla();
  reenderizar(data);
};

//Esta función es para obtener todos los elementos
const filtrarTodo = async () => {
  const data = await fetch("data/sushiData.json");
  const responseData = await data.json();
  limpiarPantalla();
  reenderizar(responseData);
};

filtrarTodo();

//aca estan todos los eventos de escucha (EventListeners)
$("#carrito").on("click", () => {showCarItems(40)});
$("#combo").on("click", filtrarCombo);
$("#pieza").on("click", filtrarPieza);
$("#ensalada").on("click", filtrarEnsalada);
$("#todos").on("click", filtrarTodo);
$("#close-button").on("click", closeCarrito);
phoneCar.addEventListener('click', () => {showCarItems(90)});
