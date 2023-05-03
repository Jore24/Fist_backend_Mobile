import express from "express";
import path from "path";
import http from "http";
import logger from "morgan";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import passport from 'passport';
import { passport as passportConfig } from "./config/passport.js";
import multer from "multer";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);
//posible error

app.disable("x-powered-by");
app.set("port", port);
const upload = multer({
  storage: multer.memoryStorage(),
})

//rutas del servidor
userRoutes(app, upload);

//usar la ip del servidor, puerto y localhost
server.listen(3000, '192.168.1.26' || 'localhost', function () {
  console.log("Servidor corriendo en el puerto: " + port);
});



//error handler


app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Algo salió mal");
});


//exportar el módulo
export default app

// ruta del servidor para probar en postamn
