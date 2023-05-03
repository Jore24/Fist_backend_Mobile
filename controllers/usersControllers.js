import User from "../models/user.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { keys as Keys } from "../config/keys.js";
import storage from "../utils/cloud_storage.js";
import Rol from "../models/rol.js";

const usersControllers = {
  async login(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    User.findByEmail(email, async (err, myUser) => {
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
          { id: myUser.id, email: myUser.email }, //aca xq decía user en ves de Myuser? revisar :v
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
          roles: JSON.parse(myUser.roles),
        };

        return res.status(201).json({
          success: true,
          message: "El usuario fue autenticado",
          data: data, // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
        });
      } else {
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

  async registerWithImage(req, res) {
    
      const user = JSON.parse(req.body.user); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
      const files = req.files;

      if (!files || files.length === 0) {
        return console.log("No files were uploaded.");
      }

      if (files.length > 0) {
        const path = `image_${Date.now()}`;
        const url = await storage(files[0], path);

        if (url != undefined && url != null) {
          user.image = url;
        }
      }

      await User.create(user, (err, data) => {
        if (err) {
          console.log("Entra el error del controlador");
          return res.status(501).json({
            success: false,
            message: "Hubo un error con el registro del usuario",
            error: err,
          });
        }
        //que hace acá?
        user.id = `${data}`;
        const token = jwt.sign(
          { id: user.id, email: user.email },
          Keys.secretOrKey,
          {}
        );
        user.session_token = `JWT ${token}`;
        Rol.create(user.id, 3, (err, data) => {
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
            data: user, // EL ID DEL NUEVO USUARIO QUE SE REGIS
          });
        });
      });
  },
};

//exportar modulo
export default usersControllers;
