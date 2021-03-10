const sushiList = $("#sushiList")[0];
const carritoArr = [];
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
  for (let i = 0; i < items.length; i++) {
    const { cantidad, precio } = items[i].price;
    const divItem = document.createElement("div");
    divItem.className = "carrito-item";
    divItem.innerHTML = `<div class="izquierda">
                    <span>${items[i].name}</span>
                </div>
                <div class="derecha">
                    <div class="precio">${cantidad} unidades $${precio}</div><span class="trash"><i class="fas fa-trash"></i></span>
                </div>`;
    carritoModal.append(divItem);
    total += +precio;
  }
  const divTotal = document.createElement("div");
  divTotal.className = "total-container";
  divTotal.innerHTML = `<span>Total</span> <span>$${total}</span>`;
  carritoModal.append(divTotal);
  $("#carrito-modal").css({
    display: "block",
  });

  $("#display-items").animate(
    {
      width: "40%",
    },
    "slow"
  );
};

const showCarItems = () => {
  const items = JSON.parse(localStorage.getItem("compra")) || [];
  if(carrTimes%2==0){
    openCar(items);
  }
  else{
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