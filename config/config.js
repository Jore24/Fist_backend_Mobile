//mysql
import mysql from 'mysql';

//exportar la función del módulo


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database:'delivery'
  }
  );
  
  db.connect(function(error){
    if(error){
      console.log('Error en la conexion.')
      throw error;
      
    }else{
      console.log('Conexion correcta.');
    }
  });


//exportar el modulo renombrandolo por db
export default db;
