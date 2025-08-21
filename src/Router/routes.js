import homeController from '../Views/Home/homeController.js'

import { loginController } from '../Views/Auth/Login/loginController.js'
import { SignupController } from '../Views/Auth/Signup/SignupController.js'

export const routes = {
  Home:{    
    path: "Home/index.html",
    controlador: homeController,
    private: false
  },
  Login: {
    path: `Auth/Login/index.html`,
    controlador: loginController,
    private: false,
  },
  Signup: {
    path: `Auth/Signup/index.html`,
    controlador: SignupController,
    private: false
  },
}