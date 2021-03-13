
const sushiList = $("#sushiList")[0];
let carritoArr = JSON.parse(localStorage.getItem("compra")) || [];
const carritoModal = document.getElementById("display-items");
let carrTimes = 0;

const getDataByJson = async (url) => {
  const data = await fetch(url);
  const response = await data.json();
  return response;
};

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

const openCar = (items) => {
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
      width: "40%",
    },
    "slow"
  );
};

const buyItems = (items, total) => {
  const loader = document.createElement('div');
  loader.className = 'loader-container';
  loader.innerHTML = '<div class="loader"></div><div class="loader2"></div>';
  carritoModal.innerHTML = '';
  carritoModal.append(loader);
  setTimeout(() => {
    carritoModal.innerHTML = `<form class="buy-form" id="buy-form" name="buyForm">
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
  $('#buy-form').on('submit', (e) => {
    console.log(e);
    e.preventDefault();
    console.log(items);
    const name = document.getElementById('inputName').value;
    const surname = document.getElementById('surname').value;
    const direccion = document.getElementById('address').value;
    const payment = document.getElementById('payment').value;
    console.log(name, surname, direccion, payment);
    carritoModal.innerHTML = '';
    carritoModal.append(loader);
    setTimeout(() => {
      carritoModal.innerHTML = '';
      const buyDiv = document.createElement('div');
      buyDiv.className = 'pedido';
      buyDiv.innerHTML = `<h2>Su pedido ha sido registrado</h2>
        <p>Número de orden: ${Math.floor(Math.random() * 1000)}</p>
        <p>Nombre: ${name}</p>
        <p>Apellido: ${surname}</p>
        <h2>Items:</h2>
      `;
      for(let i=0; i<items.length; i++){
        const item = document.createElement('p');
        console.log(items[i]);
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
      console.log(total);
      buyDiv.append(totalDiv);
      carritoModal.append(buyDiv);
    }, 3000);
  });

  }, 3000);
};

const deleteItem = (id) => {
  const option = confirm(
    "¿Está seguro que quiere eliminar el item seleccionado?"
  );
  if (option) {
    const newCarr = carritoArr.filter((el) => el.id !== id);
    console.log(newCarr);
    carritoArr = newCarr;
    localStorage.setItem("compra", JSON.stringify(carritoArr));
    openCar(carritoArr);
  }
};

const showCarItems = () => {
  const items = JSON.parse(localStorage.getItem("compra")) || [];
  if (carrTimes % 2 == 0) {
    openCar(items);
  } else {
    closeCarrito();
  }
  $("#close-button").on("click", closeCarrito);
  carrTimes++;
};

const closeCarrito = () => {
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

const limpiarPantalla = () => {
  sushiList.innerHTML = "";
};

const filtrarCombo = async () => {
  const dataFetch = await fetch("data/sushiData.json");
  const response = await dataFetch.json();
  const data = response.filter((el) => el.type === "combo");
  limpiarPantalla();
  reenderizar(data);
};

const filtrarPieza = async () => {
  const dataFetch = await fetch("data/sushiData.json");
  const response = await dataFetch.json();
  const data = response.filter((el) => el.type === "pieza");
  limpiarPantalla();
  reenderizar(data);
};

const filtrarEnsalada = async () => {
  const dataFetch = await fetch("data/sushiData.json");
  const response = await dataFetch.json();
  const data = response.filter((el) => el.type === "ensalada");
  limpiarPantalla();
  reenderizar(data);
};

const filtrarTodo = async () => {
  const data = await fetch("data/sushiData.json");
  const responseData = await data.json();
  limpiarPantalla();
  reenderizar(responseData);
};

filtrarTodo();

$("#carrito").on("click", showCarItems);
$("#combo").on("click", filtrarCombo);
$("#pieza").on("click", filtrarPieza);
$("#ensalada").on("click", filtrarEnsalada);
$("#todos").on("click", filtrarTodo);
$("#close-button").on("click", closeCarrito);