import Swal from 'sweetalert2';

export const alertaError = (mensaje) => {
    return Swal.fire({
        icon: "error",
        title: "Error",
        text: mensaje,
        confirmButtonText: 'Ok',
        customClass: {
            confirmButton: 'botonOK'
        }
    });
}
export const alertaOK = (mensaje) => {
    return Swal.fire({
        title: mensaje,
        icon: "success",
        draggable: true,
        confirmButtonText: 'Ok',
        customClass: {
            confirmButton: 'botonOK'
        }
    });
}
export const alertaWarning = (titulo,mensaje) => {
    return Swal.fire({
        icon: "warning",
        title: titulo,
        text: mensaje,
        confirmButtonText: 'Ok',
        customClass: {
            confirmButton: 'botonOK'
        }
    });
}
export const alertaPregunta = (mensaje) => {
    return Swal.fire({
        title: "Estas seguro?",
        text: mensaje,
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "No",
        confirmButtonText: "Si",
        customClass: {
            confirmButton: 'botonOK',
            cancelButton: 'botonCancelar'
        }
    })
}
export const alertaMensaje = (mensaje) => {
    return Swal.fire({
        title: mensaje,
        customClass: {
            confirmButton: "botonOK"
        }
    })
}
export const alertaToken = (mensaje) => {
  return Swal.fire({
    position: "top-end",
    icon: "success",
    title: mensaje,
    showConfirmButton: false,
    timer: 500,
  });
}
export const alertaTiempo = (tiempo) => {
    let timerInterval;
    return Swal.fire({
        title: "Subiendo Imagen...",
        html: 'Actualizando foto <span id="contador"></span> milisegundos.',
        timer: tiempo,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            const contador = Swal.getPopup().querySelector("#contador");
            if (!contador) return;

            timerInterval = setInterval(() => {
                const tiempoRestante = Swal.getTimerLeft();
                if (tiempoRestante !== undefined) {
                    contador.textContent = tiempoRestante;
                }
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
        },
    });
};
export const alertaOpciones = (oficio, nombreApellido) => {
    return Swal.fire({
        title: `Como desea que sea activado el Trabajador ${nombreApellido}`,
        icon: "question",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        showConfirmButton: false,
        html: `
    <button class="swal2-confirm swal2-styled botonOK" id="op1">Activar con Mesero${oficio == "3" ? "(Escojido)" : ""}</button>
    <button class="swal2-confirm swal2-styled botonOK" id="op2">Activar con Cajero${oficio == "2" ? "(Escojido)" : ""}</button>
    <button class="swal2-confirm swal2-styled botonOK" id="op3">Activar con Administrador${oficio == "1" ? "(Escojido)" : ""}</button>
  `,
        didOpen: () => {
           document.getElementById('op1').addEventListener('click', () => {
                Swal.close({ isDismissed: true, opcion: '3' });
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