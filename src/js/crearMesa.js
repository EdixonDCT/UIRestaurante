import { alertaError, alertaOK, alertaPregunta } from "./alertas";

const hash = window.location.hash.slice(1);
const formulario = document.querySelector(".form")
const numeroMesa = document.getElementById("numeroMesa");
const capacidadMesa = document.getElementById("capacidadMesa");

const validar = async (e) => {
    e.preventDefault();
    const datos = {
        numero: numeroMesa.value,
        capacidad: capacidadMesa.value
    }
    try {
        const response = await fetch("http://localhost:8080/ApiRestaurente/api/mesas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const mensaje = await response.text();

        if (!response.ok) {
            throw new Error(mensaje);
        }
        await alertaOK(mensaje);
        formulario.action = `mesas.html#${hash}`
        formulario.submit();
    } catch (error) {
        alertaError(error.message);
    }
}
formulario.addEventListener("submit", validar);
document.addEventListener("DOMContentLoaded", () =>{
    const botonVolver = document.getElementById("volver")
    botonVolver.action = `mesas.html#${hash}`;    
})