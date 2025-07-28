import Swal from 'sweetalert2';

export const alertaError = (mensaje) => {
    return Swal.fire({
        icon: "error",
        title: "Oops...",
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