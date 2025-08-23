import { alertaError, alertaOK, alertaPregunta } from "./alertas"; // importar funciones de alertas
const header = document.querySelector(".header"); // selecciona el header
const PerfilNombre = document.querySelector(".perfil__nombre"); // selecciona nombre del perfil
const Perfilfoto = document.querySelector(".perfil__imagen"); // selecciona foto del perfil
export const cargarHeader = async (hash) => { // función para cargar datos en el header
  try { // intentar ejecutar
      const response = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${hash}`); // petición al backend por trabajador
      if (!response.ok) { // si la respuesta no es correcta
          const mensaje = await response.text(); // obtiene mensaje del error
          throw new Error(mensaje); // lanza error
      }
    const data = await response.json(); // convierte respuesta a json
    
    Perfilfoto.src = `http://localhost:8080/ApiRestaurente/IMAGENES/${data.foto}`; // asigna la foto del perfil
    PerfilNombre.textContent = `${data.nombre} ${data.apellido}`  // asigna nombre y apellido
  } catch (error) { // atrapa errores
      alertaError(error.message); // muestra error en alerta
  }
}
