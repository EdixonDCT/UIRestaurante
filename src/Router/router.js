import { routes } from "./routes";

// Función principal del enrutador SPA
export const router = async (elemento) => {
  const hash = location.hash.slice(2); // Eliminamos "#/"
  const segmentos = hash.split("/").filter(seg => seg); // Extrae y filtra los segmentos del hash

  // Redirigir a Home si no hay segmentos
  if (segmentos.length === 0) {
    redirigirARuta("Home");
    return;
  }

  // Buscar la ruta y extraer parámetros
  const resultadoRuta = encontrarRuta(routes, segmentos);
  
  if (!resultadoRuta) {
    console.warn("Ruta inválida:", hash);
    elemento.innerHTML = `<h2>Ruta no encontrada</h2>`;
    return;
  }

  const [ruta, parametros] = resultadoRuta;

  // // Verificar acceso privado
  // if (ruta.private && !localStorage.getItem('token')) {
  //   redirigirARuta("Login");
  //   return;
  // }else if(!puede(ruta) && ruta.private){
  //   window.history.back()
  //   alert("Usted no puede ingresar porque no puede")
  //   return;
  // }
 
  // Cargar la vista HTML y ejecutar el controlador JS
  await cargarVista(ruta.path, elemento);
  await ruta.controlador(parametros);
};

// Redirecciona a una ruta determinada
const redirigirARuta = (ruta) => {
  location.hash = `#/${ruta}`;
};


const encontrarRuta = (routes, segmentos) => {  

  let rutaActual = routes;
  let rutaEncontrada = false;
  let parametros = {};  

  if (segmentos.length === 3 && segmentos[2].includes("=")) {
    parametros = extraerParametros(segmentos[2]);
    segmentos.pop(); // Quitamos el segmento de parámetros para procesar la ruta
  }

  // Recorremos los segmentos del hash para encontrar la ruta correspondiente
  segmentos.forEach(segmento => {

    // Si el segmento existe dentro del objeto de rutas actual, avanzamos al siguiente nivel
    if (rutaActual[segmento]) {
      rutaActual = rutaActual[segmento];
      rutaEncontrada = true;
    } else {
      // Si el segmento no existe, marcamos la ruta como no encontrada
      rutaEncontrada = false;
    }

    // Si la ruta actual es un grupo de rutas (es decir, tiene más subniveles)
    if (esGrupoRutas(rutaActual)) {

      // Verificamos si existe una ruta por defecto ("/") y si solo hay un segmento
      // Esto cubre el caso de rutas como "#/Categorias" donde se espera que "/Categorias/" sea válido
      if (rutaActual["/"] && segmentos.length == 1) {
        rutaActual = rutaActual["/"];
        rutaEncontrada = true;
      } else {
        // Si no cumple con esa condición, entonces la ruta no es válida
        rutaEncontrada = false;
      }
    }

  });

  // Retornamos la ruta encontrada junto a sus parámetros, o null si no se halló una ruta válida
  return rutaEncontrada ? [rutaActual, parametros] : null;

}

// Extrae un objeto clave-valor desde un string de parámetros tipo "id=1&modo=editar"
const extraerParametros = (parametros) => {
  const pares = parametros.split("&");
  const params = {};
  pares.forEach(par => {
    const [clave, valor] = par.split("=");
    params[clave] = valor;
  });
  return params;
};

// Carga una vista HTML externa dentro de un elemento
const cargarVista = async (path, elemento) => {
  try {
    const response = await fetch(`./src/Views/${path}`);
    if (!response.ok) throw new Error("Vista no encontrada");

    const contenido = await response.text();
    elemento.innerHTML = contenido;
  } catch (error) {
    console.error(error);
    elemento.innerHTML = `<h2>Error al cargar la vista</h2>`;
  }
};

// Verifica si un objeto representa un grupo de rutas (todas sus claves son objetos)
const esGrupoRutas = (obj) => {
  for (let key in obj) {    
    if (typeof obj[key] !== 'object' || obj[key] === null) {
      return false;
    }    
  }
  return true;
}

const puede = (ruta) => {
  const permisos = JSON.parse(localStorage.getItem('permisos'));
  const existe = permisos.some( ({nombre}) => nombre == ruta.can );
  return existe
}