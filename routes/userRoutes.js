import usersControllers from "../controllers/usersControllers.js";

const userRoutes = (app) => {
  app.post("/api/users/create", usersControllers.register);
  

  //ruta para ver si funciona
  app.get("/api/users/saludo", (req, res) => {
    res.send("Bienvenido a mi API nodemon");
  })

};
// exportar el módulo
export default userRoutes;


