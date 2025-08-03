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
export const alertaWarning = (mensaje) => {
    return Swal.fire({
        icon: "warning",
        title: "Espera.",
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
