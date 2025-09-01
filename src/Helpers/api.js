import validarToken from "./token";
const url = "http://localhost:8080/ApiRestaurante/api/";

export const get = async (endpoint) => {
  const respuesta = await fetch(url + endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${window.localStorage.getItem("token")}`
    }
  });
  let datos = await respuesta.json();
  if (datos.TokenInvalido) {
    let disponible = await validarToken();
    if (!disponible) {
      const respuestaDenuevo = await fetch(url + endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${window.localStorage.getItem("token")}`
        }
      });
      datos = await respuestaDenuevo.json();
    }
  }
  return datos;
}

export const post = async (endpoint, objeto) => {
  const respuesta = await fetch(url + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${window.localStorage.getItem("token")}`
    },
    body: JSON.stringify(objeto)
  });
  let datos = await respuesta.json();
  if (datos.TokenInvalido) {
    let disponible = await validarToken();
    if (!disponible) {
      const respuestaDenuevo = await fetch(url + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${window.localStorage.getItem("token")}`
        },
        body: JSON.stringify(objeto)
      });
      datos = await respuestaDenuevo.json();
    }
  }
  return datos;
}

export const put = async (endpoint, objeto) => {
  const respuesta = await fetch(url + endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${window.localStorage.getItem("token")}`
    },
    body: JSON.stringify(objeto)
  });
  let datos = await respuesta.json();
  if (datos.TokenInvalido) {
    let disponible = await validarToken();
    if (!disponible) {
      const respuestaDenuevo = await fetch(url + endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${window.localStorage.getItem("token")}`
        },
        body: JSON.stringify(objeto)
      });
      datos = await respuestaDenuevo.json();
    }
  }
  return datos;
}

export const patch = async (endpoint, objeto) => {
  const respuesta = await fetch(url + endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    },
    body: JSON.stringify(objeto),
  });
  let datos = await respuesta.json();
  if (datos.TokenInvalido) {
    let disponible = await validarToken();
    if (!disponible) {
      const respuestaDenuevo = await fetch(url + endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
        body: JSON.stringify(objeto),
      });
      datos = await respuestaDenuevo.json();
    }
  }
  return datos;
};

export const del = async (endpoint) => {
  const respuesta = await fetch(url + endpoint, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${window.localStorage.getItem("token")}`
    }
  });
  let datos = await respuesta.json();
  if (datos.TokenInvalido) {
    let disponible = await validarToken();
    if (!disponible) {
      const respuestaDenuevo = await fetch(url + endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${window.localStorage.getItem("token")}`
        }
      });
      datos = await respuestaDenuevo.json();
    }
  }
  return datos;
}

export const imagen = (foto) => {
  let urlSinApi = url.slice(0, -4);
  const imagenApi = urlSinApi + "IMAGENES/" + foto;
  return imagenApi;
}

export const postPublic = async (endpoint, objeto) => {
  const respuesta = await fetch(url + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(objeto)
  });
  const datos = await respuesta.json();
  return datos;
}

export const getPublic = async (endpoint) => {
  const respuesta = await fetch(url + endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
  const datos = await respuesta.json();
  return datos;
}

export const patchPublic = async (endpoint, objeto) => {
  const respuesta = await fetch(url + endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(objeto)
  });
  const datos = await respuesta.json();
  return datos;
}

export const postImagen = async (imagenInput) => {
  const archivo = imagenInput.files[0];
  const formData = new FormData();
  formData.append("imagen", archivo);
  const respuesta = await fetch(url + "imagen", {
    method: "POST",
    body: formData,
  });
  const datos = await respuesta.json();
  return datos;
}