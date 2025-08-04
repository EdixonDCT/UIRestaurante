import { alertaError, alertaOK, alertaPregunta } from "./alertas";
const header = document.querySelector(".header");
const PerfilNombre = document.querySelector(".perfil__nombre");
const Perfilfoto = document.querySelector(".perfil__imagen");
export const cargarHeader = async (hash) => {
  try {
      const response = await fetch(`http://localhost:8080/ApiRestaurente/api/trabajadores/${hash}`);
      if (!response.ok) {
          const mensaje = await response.text();
          throw new Error(mensaje);
      }
    const data = await response.json();
    
    Perfilfoto.src = `http://localhost:8080/ApiRestaurente/IMAGENES/${data.foto}`;
    PerfilNombre.textContent = `${data.nombre} ${data.apellido}` 
  } catch (error) {
      alertaError(error.message);
  }
}