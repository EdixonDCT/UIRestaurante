import { alertaError,alertaPregunta } from "../js/alertas";

const hash = window.location.hash.slice(1);
const cedula = document.querySelector('[name="cedula"]');
const nombre = document.querySelector('[name="nombre"]');
const apellido = document.querySelector('[name="apellido"]');
const oficio = document.querySelector('[name="oficio"]');
const contenedor = document.querySelector('.asignaciones');
const imagen = document.querySelector('img[alt="foto"]');
const reloj = document.querySelector(".informacion__tiempo.hora");
const fechaHoy = document.querySelector(".informacion__tiempo.fecha");
const cerrarSesion = document.getElementById("cerrarSesion");

const actualizarHora = () => {
  const ahora = new Date();
  const fecha = ahora.toISOString().split("T")[0];
  const hora = ahora.toTimeString().split(" ")[0];
  reloj.textContent = hora;
  fechaHoy.textContent = fecha;
};

actualizarHora();

setInterval(actualizarHora, 1000);
const informacion = async (e) => {
  try {
    const response = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${hash}`);
    if (hash == "") throw new Error("Cedula INVALIDA");
    if (!response.ok) {
      const mensaje = await response.text();
      throw new Error(mensaje);
    }
    const data = await response.json();

    let cedulaValor = data.cedula;
    let nombreValor = data.nombre;
    let apellidoValor = data.apellido;
    let oficioValor = data.nombreOficio;
    let fotoPfp = data.foto;

    if (!cedulaValor || !nombreValor || !apellidoValor ||!oficioValor ||!fotoPfp) throw new Error("Faltan datos del trabajador");
    //esto nunca debera ocurrir ya que hay notNull en la tabla Trabajadores o que ingrese de una vez creado el usuario antes ke la foto se añada
    //pero es unos segundos asi que no deberia ocurrir

    cedula.textContent = cedulaValor;
    nombre.textContent = nombreValor;
    apellido.textContent = apellidoValor;
    oficio.textContent = oficioValor;
    imagen.src = `http://localhost:8080/ApiRestaurente/IMAGENES/${fotoPfp}`;

    botones(data.nombreOficio);
  } catch (error) {
    alertaError(error.message);
    return;
  }
}
const botones = async (oficios) => {
  let nombres = [];
  if (oficios == "Administrador") {
    nombres = [
      "mesas",
      "caja",
      "pedidos",
      "reservas",
      "trabajadores",
      "ingredientes",
      "platillos"
    ];
  }
  else if (oficios == "Cajero") {
    nombres = [
      "mesas",
      "caja",
      "pedidos",
      "reservas"
    ];
  }
  else if (oficios == "Mesero") {
    nombres = [
      "mesas",
      "pedidos"
    ];
  }
  nombres.forEach(nombre => {
    const enlace = document.createElement("a");
    enlace.classList.add("asignaciones__boton");
    enlace.href = `${nombre}.html#${hash}`;
    enlace.textContent = `Ir a ${nombre}`;
    contenedor.appendChild(enlace);
  });

}
const CerrarSesionUsuario = async (e) => {
    e.preventDefault();
    const valor = await alertaPregunta("Deseas volver al Inicio de sesion?");
    if (valor.isConfirmed)
    {
      cerrarSesion.submit()
    }
}

document.addEventListener("DOMContentLoaded", informacion);
cerrarSesion.addEventListener("submit",CerrarSesionUsuario);