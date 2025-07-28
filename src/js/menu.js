import { alertaError, alertaOK } from "../js/alertas";

const hash = window.location.hash.slice(1);
const cedula = document.querySelector('[name="cedula"]');
const nombre = document.querySelector('[name="nombre"]');
const apellido = document.querySelector('[name="apellido"]');
const oficio = document.querySelector('[name="oficio"]');
const informacion = async (e,) =>
{
    try {
        const response = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${hash}`);
    
        if (!response.ok) {
          const mensaje = await response.text();
          throw new Error(mensaje);
        }
        const data = await response.json();
        console.log(data);
        
        cedula.textContent = data.cedula;
        nombre.textContent = data.nombre;
        apellido.textContent = data.apellido;
        oficio.textContent = data.nombreOficio;
        
      } catch (error) {
        alertaError(error.message);
        e.preventDefault
        return false;
      }
}
document.addEventListener("DOMContentLoaded", informacion);
// Mesas
// Caja
// Pedido
// Reserva
// Trabajadores
// Ingredientes
// Platillos
//         <a class="asignaciones__boton" href="anadirPedido.html">Añadir Pedido</a>
//         <a class="asignaciones__boton" href="#">Ver Pedido</a>
//         <a class="asignaciones__boton" href="#">Disponibilidad de Mesas</a>