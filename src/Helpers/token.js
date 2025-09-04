import { alertaToken, alertaWarning } from "./alertas"; // Importa funciones de alertas personalizadas
import * as api from "./api"; // Importa todas las funciones del archivo api.js como un objeto llamado api

export default async () => { // Exporta una función asíncrona por defecto
  let login = false; // Variable para indicar si se debe volver a login
  const localHost = localStorage.getItem("token"); // Obtiene el token almacenado en localStorage
  if (!localHost) return; // Si no existe token, termina la función
  const Valortoken = window.localStorage.getItem("token"); // Recupera el token actual
  const Valorefresh = window.localStorage.getItem("refreshToken"); // Recupera el refreshToken actual
  const body = { // Crea el cuerpo que se enviará a la API
    token: Valortoken, // Token actual
    refreshToken: Valorefresh, // RefreshToken actual
  };
  const datos = await api.postPublic("token", body); // Llama a la API para validar o refrescar el token
  if (datos.valido) { // Si la respuesta indica que es válido
    let cont = 0; // Contador para saber si ambos tokens se restauran
    let mensaje = ""; // Mensaje que se mostrará en alerta
    if (datos.token) { // Si hay un nuevo token
      window.localStorage.setItem("token", datos.token); // Guarda el nuevo token en localStorage
      mensaje += "Token restaurado"; // Agrega mensaje informativo
      cont++; // Aumenta el contador
    }
    if (datos.refreshToken) { // Si hay un nuevo refreshToken
      window.localStorage.setItem("refreshToken", datos.refreshToken); // Lo guarda en localStorage
      cont == 1 ? mensaje += " y RefreshToken restaurado" : mensaje += "RefreshToken restaurado"; // Construye el mensaje dependiendo del contador
    }
    if (mensaje != "") await alertaToken(mensaje); // Si hay mensaje, muestra alerta con éxito
  } else { // Si el token no es válido
    login = true; // Cambia el estado para volver a login
    await alertaWarning("Logeado Terminado", ""); // Muestra alerta de advertencia
    localStorage.clear(); // Limpia todo el localStorage
    window.location.href = "#/Login"; // Redirige al login
  }
  return login; // Devuelve si se debe volver al login o no
};
