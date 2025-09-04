export default (permiso) => { // Exporta por defecto una función que recibe un permiso como parámetro
  const permisos = JSON.parse(window.localStorage.getItem("permisos")); // Obtiene los permisos guardados en localStorage y los convierte de JSON a array
  return permisos.filter(p => p === permiso).length > 0; // Filtra el array buscando coincidencias con el permiso dado y devuelve true si existe al menos uno
};
