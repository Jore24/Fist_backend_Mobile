import usersControllers from "../controllers/usersControllers.js";

const userRoutes = (app) => {
  app.post("/api/users/create", usersControllers.register);

  //ruta para ver si funciona
  app.post("/api/users/login", usersControllers.login);
};

// exportar el módulo
export default userRoutes;
