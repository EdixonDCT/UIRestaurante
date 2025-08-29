import { alertaToken, alertaWarning } from "./alertas";
import * as api from "./api";

export default async () => {
  const localHost = localStorage.getItem("token");
  if (!localHost) return;
  const Valortoken = window.localStorage.getItem("token");
  const Valorefresh = window.localStorage.getItem("refreshToken");
  const body = {
    token: Valortoken,
    refreshToken: Valorefresh,
  };
  const datos = await api.postPublic("token", body);
  if (datos.valido) {
    let cont = 0;
    let mensaje = "";
    if (datos.token) {
      window.localStorage.setItem("token", datos.token);
      mensaje += "Token restaurado";
      cont++;
    }
    if (datos.refreshToken) {
      window.localStorage.setItem("refreshToken", datos.refreshToken);
      cont == 1 ? mensaje += " y RefreshToken restaurado" : mensaje += "RefreshToken restaurado";
    }
    if (mensaje != "") await alertaToken(mensaje);
  } else {
    await alertaWarning("Logeado Terminado", "");
    localStorage.clear();
    window.location.href = "#/Login";
  }
};
