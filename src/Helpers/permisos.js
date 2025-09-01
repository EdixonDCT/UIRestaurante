export default (permiso) => {
  const permisos = JSON.parse(window.localStorage.getItem("permisos"));
  return permisos.filter(p => p === permiso).length > 0;
};
