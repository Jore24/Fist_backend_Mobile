import db from "../config/config.js";

const Rol ={}
 Rol.create = async (id_user, id_rol, result) => {
  const sql = 
  `INSERT INTO
  user_has_roles(
    id_user,
    id_rol,
    created_at,
    updated_at
  )
  VALUES(?,?,?,?)
  `;
   await db.query(sql,
    [id_user, id_rol, new Date(), new Date()],
    (err, res) => {
      if (err) {
        console.log("Error:", err);
        result(err, null);
      } else {
        result(null, res.inserId);
      }
    }
  );
}

export default Rol;