// Cargar módulo de conexión a la base de datos con moudlo de ES6
import db from ".././config/config.js"

 const User = {};

//crear modelo del usuario

 User.create = async (user, result) => {
  const sql = `
      INSERT INTO
          users(
              email,
              name,
              lastname,
              phone,
              image,
              password,
              created_at,
              updated_at
          )
      VALUES(?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await db.query(
    sql,
    [
      user.email,
      user.name,
      user.lastname,
      user.phone,
      user.image,
      user.password,
      new Date(),
      new Date(),
    ],
    (err, res) => {
      if (err) {
        console.log("Error:", err);
        result(err, null);
      } else {
        console.log("Id del nuevo usuario:", res.insertId);
        result(null, res.insertId);
      }
    }
  );
};
//exportar el módulo
export default User;

