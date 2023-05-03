import usersControllers from "../controllers/usersControllers.js";

const userRoutes = (app, upload) => {
  app.post("/api/users/create", usersControllers.register);

  //ruta para ver si funciona
  app.post("/api/users/login", usersControllers.login);

  app.post("/api/users/createWithImage", upload.array('image', 1), usersControllers.registerWithImage);
  


};

// exportar el módulo
export default userRoutes;
