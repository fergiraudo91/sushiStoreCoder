import sushiData from '../data/sushiData.js';
alert(`Nuestro sushi disponible es: `);
for(let sushi of sushiData){
    alert(sushi.name);
}

class Sushi{
    constructor(nombre, descripcion, precios, cantidad){
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precios = precios;
        this.cantidad = cantidad;
    }

    //GETTERS Y SETTERS -> Se utilizan para trabajar el encapsulamiento de una clase 
    //permiten setear datos de una propiedad y obtenerlos sin necesidad de acceder a la propiedad en si misma
    getNombre(){
        return this.nombre;
    }
    setNombre(nombre){
        this.nombre = nombre;
    }
    getDescription(){
        return this.descripcion;
    }
    setDescription(description){
        this.descripcion = description;
    }
    getPrecios(){
        return this.precios;
    }
    setPrecios(precios){
        this.precios = precios;
    }
    getCantidad(){
        return this.cantidad;
    }
    setCantidad(cantidad){
        this.cantidad = cantidad;
    }

    //Metodos de acciones concretas
    //El método vender verifica si la cantidad es menor a 0, si lo es dará un mensaje que dirá que no hay más sushi de esa pieza disponible
    //Si hay unidades disponibles se restará a las que quedan para controlar el stock
    vender(){
        if(this.getCantidad() <= 0){
            alert('No queda más pieza disponible de ese Sushi');
            return;
        }
        //Aquí se restan las unidades que hay disponibles con las ventas realizadas
        this.setCantidad(this.getCantidad() - 1);
        alert(`Usted ha comprado exitosamente Sushi ${this.getNombre()}`);
        alert(`quedan ${this.getCantidad()} unidades`);
    }
    //El método reponer suma una cantidad determinada a la cantidad que ya está en la propiedad de la clase
    reponer(cantidad){
        this.setCantidad(this.getCantidad() + cantidad);
        alert(`Usted ahora tiene ${this.getCantidad()} de ${this.getNombre()}`);
    }
    
}

const busqueda = termino =>{
    return sushiData.find(el => el.name.toLowerCase().includes(termino.toLowerCase()));
};
//Uso del método filtro para filtrar por tipo de sushi
let tipo;
const filtro = termino => {
    tipo = termino;
    return sushiData.filter(el => el.type.includes(termino));
};

//Utilizar map para aumentar un porcentaje determinado
const arr = [];
const aumento = porcentaje => {
    sushiData.map((el) =>{
        for(let ind=0; ind<el.prices.length; ind++){
          arr.push({name: el.name, price: el.prices[ind].precio * (1 + (+porcentaje/100)), unidades: el.prices[ind].unidades});
        }  
    }     
    )};

//buscamos un sushi por prompt
const {name:sushiName, description, prices} = busqueda(prompt('Ingrese el sushi que quiere encontrar'));
prompt(`Nombre: ${sushiName}, Descripcion: ${description}`);
console.log(`precios: ${prices[0].unidades} unidades = $${prices[0].precio} - ${prices[1].unidades} unidades = $${prices[1].precio}`);
//filtramos por tipo

console.log(filtro(prompt('Ingrese el tipo de sushi (combo o pieza)')), 'SUSHI TIPO ' + tipo.toUpperCase());

//aumentamos el precio a todos los sushi
aumento(+prompt('ingrese el porcentaje que desea aumentar'));
console.log(arr);
