import { alertaError, alertaPregunta } from "../js/alertas"; // importa funciones de alerta

const hash = window.location.hash.slice(1); // obtiene hash sin '#'
const cedula = document.querySelector('[name="cedula"]'); // referencia a cedula
const nombre = document.querySelector('[name="nombre"]'); // referencia a nombre
const apellido = document.querySelector('[name="apellido"]'); // referencia a apellido
const oficio = document.querySelector('[name="oficio"]'); // referencia a oficio
const contenedor = document.querySelector('.asignaciones'); // contenedor de botones
const imagen = document.querySelector('img[alt="foto"]'); // imagen de perfil
const reloj = document.querySelector(".informacion__tiempo.hora"); // elemento hora
const fechaHoy = document.querySelector(".informacion__tiempo.fecha"); // elemento fecha
const cerrarSesion = document.getElementById("cerrarSesion"); // form cerrar sesión
let adminTemporal = false; // flag de admin temporal
const actualizarHora = () => { // función que actualiza hora/fecha
  const ahora = new Date(); // fecha/hora actual
  const fecha = ahora.toISOString().split("T")[0]; // yyyy-mm-dd
  const hora = ahora.toTimeString().split(" ")[0]; // hh:mm:ss
  reloj.textContent = hora; // coloca hora en DOM
  fechaHoy.textContent = fecha; // coloca fecha en DOM
}; // fin actualizarHora

actualizarHora(); // inicializa hora/fecha

setInterval(actualizarHora, 1000); // actualiza cada segundo
const informacion = async (e) => { // carga info del trabajador
  try { // inicia try
    const response = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${hash}`); // consulta API por cédula
    if (hash == "") throw new Error("Cedula INVALIDA"); // valida hash vacío
    if (!response.ok) { // si respuesta no ok
      const mensaje = await response.text(); // obtiene texto error
      throw new Error(mensaje); // lanza error
    } // fin validación response
    const data = await response.json(); // parsea json
    let valor = false; // control de fecha inicio
    if (data.adminTemporalInicio && data.adminTemporalFin) // si tiene rango temporal
    {
      valor = validarDiaExacto(data.adminTemporalInicio); // valida inicio
      await validarConUnDiaExtra(data.adminTemporalFin); // revisa fin +1 día
    } // fin if admin temporal
    
    if (data.adminTemporalInicio && data.adminTemporalFin && valor) { // si cumple inicio
      adminTemporal = true; // activa admin temporal
      
    } // fin set adminTemporal

    let cedulaValor = data.cedula; // toma cédula
    let nombreValor = data.nombre; // toma nombre
    let apellidoValor = data.apellido; // toma apellido
    let oficioValor = adminTemporal ? "Admin(Temporal)" : data.nombreOficio; // define oficio mostrado

    let fotoPfp = data.foto; // nombre de foto
    if (!cedulaValor || !nombreValor || !apellidoValor || !oficioValor || !fotoPfp) throw new Error("Faltan datos del trabajador"); // valida datos requeridos
    //esto nunca debera ocurrir ya que hay notNull en la tabla Trabajadores o que ingrese de una vez creado el usuario antes ke la foto se añada
    //pero es unos segundos asi que no deberia ocurrir

    cedula.textContent = cedulaValor; // pinta cédula
    nombre.textContent = nombreValor; // pinta nombre
    apellido.textContent = apellidoValor; // pinta apellido
    oficio.textContent = oficioValor; // pinta oficio
    imagen.src = `http://localhost:8080/ApiRestaurente/IMAGENES/${fotoPfp}`; // setea src de imagen

    botones(data.nombreOficio); // crea botones según oficio real
  } catch (error) { // captura errores
    alertaError(error.message); // muestra alerta de error
    return; // sale
  } // fin catch
} // fin informacion
const botones = async (oficios) => { // genera enlaces por rol
  let nombres = []; // lista de destinos
  if (oficios == "Administrador" || adminTemporal) { // si admin
    nombres = [
      "mesas", // sección mesas
      "cajas", // sección cajas
      "pedidos", // sección pedidos
      "reservas", // sección reservas
      "trabajadores", // sección trabajadores
      "ingredientes", // sección ingredientes
      "platillos" // sección platillos
    ]; // fin lista admin
  }
  else if (oficios == "Cajero") { // si cajero
    nombres = [
      "mesas", // mesas
      "cajas", // cajas
      "pedidos", // pedidos
      "reservas" // reservas
    ]; // fin lista cajero
  }
  else if (oficios == "Mesero") { // si mesero
    nombres = [
      "mesas", // mesas
      "pedidos" // pedidos
    ]; // fin lista mesero
  }
  nombres.forEach(nombre => { // crea cada botón
    const enlace = document.createElement("a"); // crea <a>
    enlace.classList.add("asignaciones__boton"); // agrega clase
    enlace.href = `${nombre}/${nombre}Tablas.html#${hash}`; // compone href
    enlace.textContent = `Ir a ${nombre}`; // texto del botón
    contenedor.appendChild(enlace); // inserta en contenedor
  }); // fin forEach

} // fin botones
const CerrarSesionUsuario = async (e) => { // maneja cierre de sesión
  e.preventDefault(); // evita submit por defecto
  const valor = await alertaPregunta("Deseas volver al Inicio de sesion?"); // confirma acción
  if (valor.isConfirmed) { // si confirma
    cerrarSesion.submit() // envía formulario
  } // fin if
} // fin CerrarSesionUsuario
const validarDiaExacto = (fechaStr) => { // verifica si fecha <= hoy
  // fechaStr viene en formato "YYYY-MM-DD"
  const [anio, mes, dia] = fechaStr.split("-").map(Number);

  // Crear fecha de hoy en local (sin horas)
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Crear fecha a validar (también sin horas, en local)
  const fecha = new Date(anio, mes - 1, dia); // 👈 evita el UTC shift

  // Validar: fecha <= hoy
  return fecha <= hoy;
}; // fin validarDiaExacto
const validarConUnDiaExtra = async (fechaStr) => { // desactiva admin si pasó fin+1
  // Hoy (local) a medianoche
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Construir fecha base en local y sumarle 1 día
  const [anio, mes, dia] = fechaStr.split("-").map(Number);
  const limite = new Date(anio, mes - 1, dia);
  limite.setHours(0, 0, 0, 0);
  limite.setDate(limite.getDate() + 1); // +1 día

  // Mostrar fechas
  console.log("📅 Fecha original:", fechaStr); // log fecha original
  console.log("➕ Fecha con +1 día:", limite.toISOString().split("T")[0]); // log fecha límite
  console.log("🕒 Hoy:", hoy.toISOString().split("T")[0]); // log hoy

  if (hoy >= limite) { // si se pasó el límite
    console.log("✅ TRUE: ya pasó el día límite."); // log confirmación
    try { // intenta desactivar
      const actualizar = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/desactivarAdmin/${hash}`, { // endpoint desactivar
        method: "PATCH", // método PATCH
        headers: {
          "Content-Type": "application/json" // tipo JSON
        },
        body: JSON.stringify({}) // body vacío
      }); // fin fetch
      const mensaje = await actualizar.text(); // obtiene mensaje
      console.log(mensaje); // log respuesta
      await alertaError("Trabajador: se acabo el administrador temporal CIERRE AUTOMATICO."); // notifica fin
      window.location.replace("../../.."); // redirige a inicio
    } catch (error) { // si falla
      alertaError(error.message); // muestra error
    } // fin catch
  } else {
    console.log("❌ FALSE: aún no llega el día límite."); // aún no expira
  } // fin if
} // fin validarConUnDiaExtra

document.addEventListener("DOMContentLoaded", informacion); // carga info al inicio
cerrarSesion.addEventListener("submit", CerrarSesionUsuario); // escucha submit de cierre
