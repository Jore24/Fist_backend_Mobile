import User from "../models/user.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { keys as Keys } from "../config/keys.js";

const usersControllers = {
  async login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    User.findByEmail(email, async (err, myUser) => {
      console.log("debug", myUser)
      if (err) {
        return res.status(501).json({
          success: false,
          message: "Hubo un error con ENCONTRAR del usuario",
          error: err,
        });
      }
      if (!myUser) {
        return res.status(501).json({
          success: false,
          message: "El email no fue encontrado",
        });
      }
      const isPasswordValid = await bcrypt.compare(password, myUser.password);
      if (isPasswordValid) {
        const token = jwt.sign(
          { id: myUser.id, email: myUser.email },
          Keys.secretOrKey,
          {}
        );
        const data = {
          id: myUser.id,
          name: myUser.name,
          lastname: myUser.lastname,
          email: myUser.email,
          phone: myUser.phone,
          image: myUser.image,
          session_token: `JWT ${token}`,
        };

        return res.status(201).json({
          success: true,
          message: "El usuario fue autenticado",
          data: data, // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
        });
      }
      else{
        return res.status(401).json({
          success: false,
          message: "La contraseña es incorrecta",
        });

      }

    });

  },

  async register(req, res) {
    const user = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
    await User.create(user, (err, data) => {
      if (err) {
        console.log("Entra el error del controlador");
        return res.status(501).json({
          success: false,
          message: "Hubo un error con el registro del usuario",
          error: err,
        });
      }

      return res.status(201).json({
        success: true,
        message: "El registro se realizo correctamente",
        data: data, // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
      });
    });
  },
};

//exportar modulo
export default usersControllers;
