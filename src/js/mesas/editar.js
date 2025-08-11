import { alertaError, alertaOK, alertaPregunta } from "../alertas";
import { cargarHeader } from "../header";

const hash = window.location.hash.slice(1);
const lista = hash.split("/");
const idUser = lista[0];
const idMesa = lista[1];

const formulario = document.querySelector(".form")
const numeroMesa = document.querySelector(".numeroMesa");
const capacidadMesa = document.querySelector(".capacidadMesa");

const validar = async (e) => {
    e.preventDefault();
    const datos = {
        capacidad: capacidadMesa.value
    }
    try {
        const response = await fetch(`http://localhost:8080/ApiRestaurente/api/mesas/${idMesa}`, {
            method: "PUT",
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
        formulario.action = `mesasTablas.html#${idUser}`
        formulario.submit();
    } catch (error) {
        alertaError(error.message);
    }
}
const infoMesa = async () => {
    const botonVolver = document.getElementById("volver")
    botonVolver.action = `mesasTablas.html#${idUser}`;    
    try {
        const response = await fetch(`http://localhost:8080/ApiRestaurente/api/mesas/${idMesa}`);
        const data = await response.json();
        numeroMesa.value = data.numero;
        capacidadMesa.value = data.capacidad;
    } catch (error) {
        console.error("Error:", error);
    }
}
document.addEventListener("DOMContentLoaded", () =>
{
  cargarHeader(idUser);
  infoMesa();
});
formulario.addEventListener("submit", validar);