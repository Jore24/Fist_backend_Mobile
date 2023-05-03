// Cargar módulo de conexión a la base de datos con moudlo de ES6
import db from ".././config/config.js"
import * as bcrypt from "bcrypt";

 const User = {};

  User.findByEmail =  (email, result) => {
  
  const sql = `SELECT 
      U.id,
      U.email,
      U.name,
      U.lastname,
      U.image,
      U.phone,	
      U.password,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', CONVERT(R.id, char),
          'name', R.name,
          'image', R.image,
          'route', R.route
    )
    ) AS roles

    FROM
      users AS U

      INNER JOIN
        user_has_roles AS UHR
    ON
      UHR.id_user = U.id

    INNER JOIN

      roles AS R
      
    ON
      UHR.id_rol = R.id

    WHERE

      email = ?
    GROUP BY
      
      U.id`;
  console.log("email del modelo user", email)
  console.log("sql del modelo user", sql)
  db.query(sql,
    [email],
    (err, user) => {
      if (err) {
        console.log("Error:", err);
        result(err, null);
      } else {
        result(null, user[0]);
        console.log("Usuario con el Email encontrado", user[0]);
      }
    }
  );
};


User.findById =  (id, result) => {
        const sql = `SELECT 
        U.id,
        U.email,
        U.name,
        U.lastname,
        U.image,
        U.phone,	
        U.password,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', CONVERT(R.id, char),
            'name', R.name,
            'image', R.image,
            'route', R.route
      )
      ) AS roles

      FROM
        users AS U

        INNER JOIN
          user_has_roles AS UHR
      ON
        UHR.id_user = U.id

      INNER JOIN

        roles AS R
        
      ON
        UHR.id_rol = R.id

      WHERE

        id = ?
      GROUP BY
        
        U.id`;
  db.query(sql,
    [id],
    (err, user) => {
      if (err) {
        console.log("Error:", err);
        result(err, null);
      } else {
        result(null, user[0]);
        console.log("Usuario encontrado", user[0]);
      }
    }
  );
};



//crear modelo del usuario

 User.create = async (user, result) => {
  //encriptar contraseña
  const hashPassword = await bcrypt.hash(user.password, 10); //aplicar clean architecture

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
      hashPassword,
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

