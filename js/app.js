// Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// Eventos

eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}


// Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        if(this.restante >= gasto.cantidad){
            this.gastos = [...this.gastos, gasto];
            this.calcularRestante();
        }else{
            ui.imprimirAlerta('Se supera el presupuesto restante','error');
        }
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) =>  total + gasto.cantidad, 0);

        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id)
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        // Extraemos el valor
        const { presupuesto, restante } = cantidad;

        // Agregamos a el HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        // Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }

        // Agregamos el mensaje
        divMensaje.textContent = mensaje;

        // lo insertamos
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove();
        },3000);
    }
    // limpiamso el HTML
    limpiarHTML() {

        while( gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    // mostramos el listado
    mostrarGastos(gastos) {
        //Reinicamos los gastos en pantalla
        this.limpiarHTML();

        // interar sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            // Crear li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;            

            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> ${cantidad} </span>`;

            // Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        });
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        // Comprobar 25%
        if( (presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if( (presupuesto / 2) > restante) { //50%
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }
    }
}

//Inicalizaciones

let presupuesto;
const ui = new UI();


// Funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto');

    if(presupuestoUsuario === '' || presupuestoUsuario === null ||  isNaN( presupuestoUsuario ) || presupuestoUsuario <= 0){
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
    e.preventDefault();

    // leer los datos
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // Validar
    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios','error');

        return;
    } else if(cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no valida','error');

        return;
    }

    // Generamos el objeto de gasto
    const gasto = { nombre, cantidad, id: Date.now() };

    // Agregamos el nuevo gasto
    presupuesto.nuevoGasto(gasto);

    // Imprimimos todo bien
    ui.imprimirAlerta('Gasto agregado correctamente');

    // Imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);
    
    ui.comprobarPresupuesto(presupuesto);

    // Reiniciamos el fromulario
    formulario.reset();
}

function eliminarGasto(id) {
    presupuesto.eliminarGasto(id);
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}