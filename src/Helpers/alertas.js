import Swal from 'sweetalert2'; // Importa la librería SweetAlert2

export const alertaError = (mensaje) => { // Exporta función para mostrar alertas de error
    return Swal.fire({ // Retorna la alerta de SweetAlert2
        icon: "error", // Ícono de error
        title: "Error", // Título de la alerta
        text: mensaje, // Texto con el mensaje recibido
        confirmButtonText: 'Ok', // Texto del botón de confirmación
        customClass: { // Personalización de clases CSS
            confirmButton: 'botonOK' // Clase personalizada para el botón
        }
    });
}
export const alertaOK = (mensaje) => { // Exporta función para mostrar alertas de éxito
    return Swal.fire({ // Retorna la alerta
        title: mensaje, // Título con el mensaje recibido
        icon: "success", // Ícono de éxito
        draggable: true, // Permite mover la alerta
        confirmButtonText: 'Ok', // Texto del botón
        customClass: { // Clases personalizadas
            confirmButton: 'botonOK' // Clase CSS del botón
        }
    });
}
export const alertaWarning = (titulo,mensaje) => { // Exporta función para mostrar alertas de advertencia
    return Swal.fire({ // Retorna la alerta
        icon: "warning", // Ícono de advertencia
        title: titulo, // Título de la alerta
        text: mensaje, // Texto con el mensaje recibido
        confirmButtonText: 'Ok', // Texto del botón
        customClass: { // Personalización de clases CSS
            confirmButton: 'botonOK' // Clase para el botón
        }
    });
}
export const alertaPregunta = (mensaje) => { // Exporta función para mostrar alertas tipo pregunta
    return Swal.fire({ // Retorna la alerta
        title: "Estas seguro?", // Título fijo
        text: mensaje, // Texto dinámico recibido
        icon: "question", // Ícono de pregunta
        showCancelButton: true, // Muestra botón de cancelar
        cancelButtonText: "No", // Texto del botón cancelar
        confirmButtonText: "Si", // Texto del botón confirmar
        customClass: { // Personalización
            confirmButton: 'botonOK', // Clase CSS botón confirmar
            cancelButton: 'botonCancelar' // Clase CSS botón cancelar
        }
    })
}
export const alertaMensaje = (mensaje) => { // Exporta función para mostrar alertas simples con mensaje
    return Swal.fire({ // Retorna la alerta
        title: mensaje, // Título con el mensaje recibido
        customClass: { // Personalización
            confirmButton: "botonOK" // Clase CSS del botón
        }
    })
}
export const alertaToken = (mensaje) => { // Exporta función para mostrar alertas de éxito rápidas
  return Swal.fire({ // Retorna la alerta
    position: "top-end", // Muestra la alerta en la esquina superior derecha
    icon: "success", // Ícono de éxito
    title: mensaje, // Mensaje recibido
    showConfirmButton: false, // Oculta el botón de confirmación
    timer: 500, // Duración en milisegundos
  });
}
export const alertaTiempo = (tiempo) => { // Exporta función para mostrar alertas con contador
    let timerInterval; // Variable para manejar el intervalo del contador
    return Swal.fire({ // Retorna la alerta
        title: "Subiendo Imagen...", // Título fijo
        html: 'Actualizando foto <span id="contador"></span> milisegundos.', // Texto con contador dinámico
        timer: tiempo, // Duración recibida por parámetro
        timerProgressBar: true, // Muestra barra de progreso
        didOpen: () => { // Función que se ejecuta al abrir la alerta
            Swal.showLoading(); // Muestra animación de carga
            const contador = Swal.getPopup().querySelector("#contador"); // Selecciona el span del contador
            if (!contador) return; // Si no existe, termina

            timerInterval = setInterval(() => { // Intervalo para actualizar el contador
                const tiempoRestante = Swal.getTimerLeft(); // Obtiene el tiempo restante
                if (tiempoRestante !== undefined) { // Si existe tiempo restante
                    contador.textContent = tiempoRestante; // Actualiza el texto del contador
                }
            }, 100); // Cada 100 ms
        },
        willClose: () => { // Función al cerrar la alerta
            clearInterval(timerInterval); // Limpia el intervalo
        },
    });
};
export const alertaOpciones = (rol, nombreApellido) => { // Exporta función para mostrar opciones de activación
    return Swal.fire({ // Retorna la alerta
        title: `Como desea que sea activado el Trabajador ${nombreApellido}`, // Título dinámico con el nombre
        icon: "question", // Ícono de pregunta
        cancelButtonText: "Cancelar", // Texto del botón cancelar
        showCancelButton: true, // Muestra botón cancelar
        showConfirmButton: false, // Oculta botón confirmar por defecto
        html: `
    <button class="swal2-confirm swal2-styled botonOK" id="op1">Activar con Mesero${rol == "3" ? "(Escojido)" : ""}</button>
    <button class="swal2-confirm swal2-styled botonOK" id="op2">Activar con Cajero${rol == "2" ? "(Escojido)" : ""}</button>
    <button class="swal2-confirm swal2-styled botonOK" id="op3">Activar con Administrador${rol == "1" ? "(Escojido)" : ""}</button>
  `,
        didOpen: () => { // Al abrir la alerta
           document.getElementById('op1').addEventListener('click', () => { // Evento click en opción 1
                Swal.close({ isDismissed: true, opcion: '3' }); // Cierra alerta con opción 3
            });
            document.getElementById('op2').addEventListener('click', () => { // Evento click en opción 2
                Swal.close({ isDismissed: true, opcion: '2' }); // Cierra alerta con opción 2
            });
            document.getElementById('op3').addEventListener('click', () => { // Evento click en opción 3
                Swal.close({ isDismissed: true, opcion: '1' }); // Cierra alerta con opción 1
            });
        },
        customClass: { // Personalización de clases
            op1: 'botonOK', // Clase botón opción 1
            cancelButton: 'botonCancelar' // Clase botón cancelar
        }
    });
}
