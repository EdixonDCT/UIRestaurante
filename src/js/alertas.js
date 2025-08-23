import Swal from 'sweetalert2'; // librería de alertas

// alerta de error
export const alertaError = (mensaje) => {
    return Swal.fire({
        icon: "error", // ícono de error
        title: "Error", // título
        text: mensaje, // mensaje recibido
        confirmButtonText: 'Ok', // botón
        customClass: {
            confirmButton: 'botonOK' // clase personalizada
        }
    });
}

// alerta de éxito
export const alertaOK = (mensaje) => {
    return Swal.fire({
        title: mensaje, // mensaje dinámico
        icon: "success", // ícono éxito
        draggable: true, // se puede arrastrar
        confirmButtonText: 'Ok',
        customClass: {
            confirmButton: 'botonOK'
        }
    });
}

// alerta de advertencia
export const alertaWarning = (mensaje) => {
    return Swal.fire({
        icon: "warning", // ícono warning
        title: "Espera.", // título fijo
        text: mensaje, // mensaje dinámico
        confirmButtonText: 'Ok',
        customClass: {
            confirmButton: 'botonOK'
        }
    });
}

// alerta de confirmación (sí/no)
export const alertaPregunta = (mensaje) => {
    return Swal.fire({
        title: "Estas seguro?", // título
        text: mensaje, // texto dinámico
        icon: "question", // ícono de pregunta
        showCancelButton: true, // muestra botón cancelar
        cancelButtonText: "No", // texto cancelar
        confirmButtonText: "Si", // texto confirmar
        customClass: {
            confirmButton: 'botonOK',
            cancelButton: 'botonCancelar'
        }
    })
}

// alerta simple con solo mensaje
export const alertaMensaje = (mensaje) => {
    return Swal.fire({
        title: mensaje, // mensaje dinámico
        customClass: {
            confirmButton: "botonOK"
        }
    })
}

// alerta con tiempo y contador
export const alertaTiempo = (tiempo) => {
    let timerInterval; // guarda intervalo
    return Swal.fire({
        title: "Subiendo Imagen...",
        html: 'Actualizando foto <span id="contador"></span> milisegundos.',
        timer: tiempo, // tiempo límite
        timerProgressBar: true, // barra de progreso
        didOpen: () => { // cuando abre
            Swal.showLoading(); // muestra carga
            const contador = Swal.getPopup().querySelector("#contador"); // selecciona span contador
            if (!contador) return;

            timerInterval = setInterval(() => { // actualiza cada 100ms
                const tiempoRestante = Swal.getTimerLeft(); // tiempo restante
                if (tiempoRestante !== undefined) {
                    contador.textContent = tiempoRestante; // muestra tiempo
                }
            }, 100);
        },
        willClose: () => { // cuando se cierra
            clearInterval(timerInterval); // limpia intervalo
        },
    });
};

// alerta con opciones personalizadas
export const alertaOpciones = (oficio, nombreApellido) => {
    return Swal.fire({
        title: `Como desea que sea activado el Trabajador ${nombreApellido}`, // título dinámico
        icon: "question",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        showConfirmButton: false, // ocultar botón por defecto
        html: `
    <button class="swal2-confirm swal2-styled botonOK" id="op1">Activar con Mesero${oficio == "3" ? "(Escojido)" : ""}</button>
    <button class="swal2-confirm swal2-styled botonOK" id="op2">Activar con Cajero${oficio == "2" ? "(Escojido)" : ""}</button>
    <button class="swal2-confirm swal2-styled botonOK" id="op3">Activar con Administrador${oficio == "1" ? "(Escojido)" : ""}</button>
  `, // botones dinámicos según oficio
        didOpen: () => { // cuando abre
           document.getElementById('op1').addEventListener('click', () => {
                Swal.close({ isDismissed: true, opcion: '3' }); // cierra y devuelve opción
            });
            document.getElementById('op2').addEventListener('click', () => {
                Swal.close({ isDismissed: true, opcion: '2' });
            });
            document.getElementById('op3').addEventListener('click', () => {
                Swal.close({ isDismissed: true, opcion: '1' });
            });
        },
        customClass: {
            op1: 'botonOK',
            cancelButton: 'botonCancelar'
        }
    });
}
