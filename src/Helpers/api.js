import validarToken from "./token"; // Importa la función validarToken desde el archivo token.js
const url = "http://localhost:8080/ApiRestaurante/api/"; // URL base de la API

export const get = async (endpoint) => { // Exporta función GET asíncrona
  const respuesta = await fetch(url + endpoint, { // Hace petición GET concatenando el endpoint
    method: "GET", // Método HTTP GET
    headers: { // Encabezados de la petición
      "Content-Type": "application/json", // Tipo de contenido JSON
      "Authorization": `Bearer ${window.localStorage.getItem("token")}` // Token guardado en localStorage
    }
  });
  let datos = await respuesta.json(); // Convierte la respuesta a JSON
  if (datos.TokenInvalido) { // Verifica si el token es inválido
    let disponible = await validarToken(); // Intenta validar el token
    if (!disponible) { // Si no es válido
      const respuestaDenuevo = await fetch(url + endpoint, { // Hace nuevamente la petición GET
        method: "GET", // Método HTTP GET
        headers: { // Encabezados
          "Content-Type": "application/json", // Tipo JSON
          "Authorization": `Bearer ${window.localStorage.getItem("token")}` // Nuevo token de localStorage
        }
      });
      datos = await respuestaDenuevo.json(); // Convierte la respuesta a JSON
    }
  }
  return datos; // Retorna los datos obtenidos
}

export const post = async (endpoint, objeto) => { // Exporta función POST asíncrona
  const respuesta = await fetch(url + endpoint, { // Hace petición POST
    method: 'POST', // Método HTTP POST
    headers: { // Encabezados
      'Content-Type': 'application/json', // Tipo JSON
      "Authorization": `Bearer ${window.localStorage.getItem("token")}` // Token de localStorage
    },
    body: JSON.stringify(objeto) // Convierte el objeto a JSON para enviarlo
  });
  let datos = await respuesta.json(); // Convierte la respuesta a JSON
  if (datos.TokenInvalido) { // Verifica token inválido
    let disponible = await validarToken(); // Intenta validar el token
    if (!disponible) { // Si no se valida
      const respuestaDenuevo = await fetch(url + endpoint, { // Repite petición POST
        method: 'POST', // Método POST
        headers: { // Encabezados
          'Content-Type': 'application/json', // Tipo JSON
          "Authorization": `Bearer ${window.localStorage.getItem("token")}` // Token actualizado
        },
        body: JSON.stringify(objeto) // Envía el objeto en formato JSON
      });
      datos = await respuestaDenuevo.json(); // Convierte la respuesta
    }
  }
  return datos; // Retorna los datos obtenidos
}

export const put = async (endpoint, objeto) => { // Exporta función PUT asíncrona
  const respuesta = await fetch(url + endpoint, { // Hace petición PUT
    method: 'PUT', // Método HTTP PUT
    headers: { // Encabezados
      'Content-Type': 'application/json', // Tipo JSON
      "Authorization": `Bearer ${window.localStorage.getItem("token")}` // Token
    },
    body: JSON.stringify(objeto) // Convierte objeto a JSON
  });
  let datos = await respuesta.json(); // Convierte respuesta a JSON
  if (datos.TokenInvalido) { // Verifica token inválido
    let disponible = await validarToken(); // Intenta validar token
    if (!disponible) { // Si no funciona
      const respuestaDenuevo = await fetch(url + endpoint, { // Vuelve a hacer PUT
        method: 'PUT', // Método PUT
        headers: { // Encabezados
          'Content-Type': 'application/json', // Tipo JSON
          "Authorization": `Bearer ${window.localStorage.getItem("token")}` // Token nuevo
        },
        body: JSON.stringify(objeto) // Envía el objeto
      });
      datos = await respuestaDenuevo.json(); // Convierte a JSON
    }
  }
  return datos; // Retorna los datos
}

export const patch = async (endpoint, objeto) => { // Exporta función PATCH asíncrona
  const respuesta = await fetch(url + endpoint, { // Hace petición PATCH
    method: "PATCH", // Método HTTP PATCH
    headers: { // Encabezados
      "Content-Type": "application/json", // Tipo JSON
      Authorization: `Bearer ${window.localStorage.getItem("token")}`, // Token
    },
    body: JSON.stringify(objeto), // Convierte objeto a JSON
  });
  let datos = await respuesta.json(); // Convierte respuesta
  if (datos.TokenInvalido) { // Verifica token inválido
    let disponible = await validarToken(); // Intenta validar
    if (!disponible) { // Si no funciona
      const respuestaDenuevo = await fetch(url + endpoint, { // Repite PATCH
        method: "PATCH", // Método PATCH
        headers: { // Encabezados
          "Content-Type": "application/json", // Tipo JSON
          Authorization: `Bearer ${window.localStorage.getItem("token")}`, // Token nuevo
        },
        body: JSON.stringify(objeto), // Envía objeto
      });
      datos = await respuestaDenuevo.json(); // Convierte respuesta
    }
  }
  return datos; // Retorna datos
};

export const del = async (endpoint) => { // Exporta función DELETE asíncrona
  const respuesta = await fetch(url + endpoint, { // Hace petición DELETE
    method: 'DELETE', // Método DELETE
    headers: { // Encabezados
      'Content-Type': 'application/json', // Tipo JSON
      "Authorization": `Bearer ${window.localStorage.getItem("token")}` // Token
    }
  });
  let datos = await respuesta.json(); // Convierte respuesta a JSON
  if (datos.TokenInvalido) { // Verifica token inválido
    let disponible = await validarToken(); // Intenta validar token
    if (!disponible) { // Si no sirve
      const respuestaDenuevo = await fetch(url + endpoint, { // Repite DELETE
        method: 'DELETE', // Método DELETE
        headers: { // Encabezados
          'Content-Type': 'application/json', // Tipo JSON
          "Authorization": `Bearer ${window.localStorage.getItem("token")}` // Token nuevo
        }
      });
      datos = await respuestaDenuevo.json(); // Convierte respuesta
    }
  }
  return datos; // Retorna datos
}

export const imagen = (foto) => { // Exporta función para generar URL de imagen
  let urlSinApi = url.slice(0, -4); // Quita "api/" de la URL base
  const imagenApi = urlSinApi + "IMAGENES/" + foto; // Concatena ruta de imágenes con el nombre
  return imagenApi; // Retorna URL completa de la imagen
}

export const imagendel = async (endpoint) => { // Exporta función para eliminar imagen
  const respuesta = await fetch(url + endpoint, { // Hace petición DELETE
    method: 'DELETE', // Método DELETE
    headers: { // Encabezados
      'Content-Type': 'application/json', // Tipo JSON
      "Authorization": `Bearer ${window.localStorage.getItem("token")}` // Token
    }
  });
  let datos = await respuesta.text(); // Convierte respuesta a texto
  return datos; // Retorna el texto
}

export const postPublic = async (endpoint, objeto) => { // Exporta función POST pública (sin token)
  const respuesta = await fetch(url + endpoint, { // Hace petición POST
    method: 'POST', // Método POST
    headers: { // Encabezados
      'Content-Type': 'application/json', // Tipo JSON
    },
    body: JSON.stringify(objeto) // Convierte objeto a JSON
  });
  const datos = await respuesta.json(); // Convierte respuesta
  return datos; // Retorna datos
}

export const getPublic = async (endpoint) => { // Exporta función GET pública
  const respuesta = await fetch(url + endpoint, { // Hace petición GET
    method: "GET", // Método GET
    headers: { // Encabezados
      "Content-Type": "application/json", // Tipo JSON
    }
  });
  const datos = await respuesta.json(); // Convierte respuesta
  return datos; // Retorna datos
}

export const patchPublic = async (endpoint, objeto) => { // Exporta función PATCH pública
  const respuesta = await fetch(url + endpoint, { // Hace petición PATCH
    method: 'PATCH', // Método PATCH
    headers: { // Encabezados
      'Content-Type': 'application/json' // Tipo JSON
    },
    body: JSON.stringify(objeto) // Convierte objeto a JSON
  });
  const datos = await respuesta.json(); // Convierte respuesta
  return datos; // Retorna datos
}

export const postImagen = async (imagenInput) => { // Exporta función para subir imagen
  const archivo = imagenInput.files[0]; // Obtiene el primer archivo del input
  const formData = new FormData(); // Crea un FormData para archivos
  formData.append("imagen", archivo); // Agrega el archivo al FormData
  const respuesta = await fetch(url + "imagen", { // Hace petición POST a /imagen
    method: "POST", // Método POST
    body: formData, // Envia la imagen
  });
  const datos = await respuesta.json(); // Convierte respuesta
  return datos; // Retorna datos
}
