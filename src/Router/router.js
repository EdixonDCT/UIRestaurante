import { routes } from "./routes"; // Importamos las rutas definidas en otro archivo

// Función principal del enrutador SPA
export const router = async (elemento) => { // Función router que carga vistas según la URL
  const hash = location.hash.slice(2); // Eliminamos "#/" del hash de la URL
  const segmentos = hash.split("/").filter(seg => seg); // Dividimos en segmentos y quitamos vacíos

  if (segmentos.length === 0) { // Si no hay segmentos (ruta vacía)
    redirigirARuta("Home"); // Redirigimos a Home
    return;
  }

  const resultadoRuta = encontrarRuta(routes, segmentos); // Buscamos la ruta correspondiente
  
  if (!resultadoRuta) { // Si no se encuentra la ruta
    console.warn("Ruta inválida:", hash); // Mostramos advertencia en consola
    elemento.innerHTML = `<h2>Ruta no encontrada</h2>`; // Mostramos mensaje en pantalla
    return;
  }

  const [ruta, parametros] = resultadoRuta; // Desestructuramos la ruta y los parámetros

  if (ruta.private) { // Si la ruta es privada
    if (ruta.private && !localStorage.getItem('token')) { // Si no hay token
      redirigirARuta("Login"); // Redirigimos al login
      return;
    } else if (!puede(ruta) && ruta.private) { // Si la ruta es privada pero no tiene permiso
      window.history.back(); // Volvemos atrás en el historial
      alert("Usted no puede ingresar porque no puede"); // Mostramos alerta
      return;
    }
  }

  await cargarVista(ruta.path, elemento); // Cargamos la vista HTML en el contenedor
  await ruta.controlador(parametros); // Ejecutamos el controlador JS de la ruta
};

// Redirecciona a una ruta determinada
const redirigirARuta = (ruta) => { 
  location.hash = `#/${ruta}`; // Cambia el hash de la URL
};

const encontrarRuta = (routes, segmentos) => { // Busca la ruta según los segmentos de la URL  
  let rutaActual = routes; // Comenzamos desde el objeto de rutas raíz
  let rutaEncontrada = false; // Bandera para saber si existe
  let parametros = {}; // Objeto para guardar parámetros  

  if (segmentos.length === 3 && segmentos[2].includes("=")) { // Si hay parámetros en el hash
    parametros = extraerParametros(segmentos[2]); // Extraemos los parámetros
    segmentos.pop(); // Quitamos el último segmento (los parámetros)
  }

  segmentos.forEach(segmento => { // Recorremos los segmentos
    if (rutaActual[segmento]) { // Si el segmento existe en las rutas
      rutaActual = rutaActual[segmento]; // Avanzamos al siguiente nivel
      rutaEncontrada = true; // Marcamos como encontrada
    } else { 
      rutaEncontrada = false; // Si no existe, ruta inválida
    }

    if (esGrupoRutas(rutaActual)) { // Si lo encontrado es un grupo de rutas
      if (rutaActual["/"] && segmentos.length == 1) { // Si tiene ruta por defecto "/"
        rutaActual = rutaActual["/"]; // Tomamos esa ruta
        rutaEncontrada = true;
      } else {
        rutaEncontrada = false; // No hay ruta válida
      }
    }
  });

  return rutaEncontrada ? [rutaActual, parametros] : null; // Retornamos la ruta encontrada o null
};

// Extrae un objeto clave-valor desde un string tipo "id=1&modo=editar"
const extraerParametros = (parametros) => {
  const pares = parametros.split("&"); // Dividimos cada par
  const params = {}; // Objeto resultado
  pares.forEach(par => {
    const [clave, valor] = par.split("="); // Dividimos clave=valor
    params[clave] = valor; // Guardamos en el objeto
  });
  return params; // Devolvemos los parámetros
};

// Carga una vista HTML externa dentro de un elemento
const cargarVista = async (path, elemento) => {
  try {
    const response = await fetch(`./src/Views/${path}`); // Pedimos el archivo HTML
    if (!response.ok) throw new Error("Vista no encontrada"); // Si falla, lanzamos error

    const contenido = await response.text(); // Obtenemos el HTML como texto
    elemento.innerHTML = contenido; // Lo insertamos en el elemento
  } catch (error) {
    console.error(error); // Mostramos error en consola
    elemento.innerHTML = `<h2>Error al cargar la vista</h2>`; // Mensaje de error en pantalla
  }
};

// Verifica si un objeto representa un grupo de rutas (todas sus claves son objetos)
const esGrupoRutas = (obj) => {
  for (let key in obj) {    
    if (typeof obj[key] !== 'object' || obj[key] === null) { // Si alguna clave no es objeto
      return false; // No es un grupo de rutas
    }    
  }
  return true; // Todas son objetos -> sí es un grupo de rutas
}

const puede = (ruta) => { // Verifica si el usuario tiene permiso para acceder
  const permisos = JSON.parse(localStorage.getItem('permisos')); // Obtenemos permisos desde localStorage
  const existe = permisos.some((nombre) => nombre == ruta.can); // Verificamos si tiene el permiso necesario
  return existe; // Retornamos true o false
}
