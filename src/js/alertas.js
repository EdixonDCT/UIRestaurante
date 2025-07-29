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
        confirmButtonText: "Si, volver",
        customClass: {
            confirmButton: 'botonOK',
            cancelButton: 'botonCancelar'
        }
    })
}