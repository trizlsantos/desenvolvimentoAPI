//Instruções para conectar com o banco de dado
import { Sequelize } from "sequelize";
//Banco    //user  //Senha
// export const conn = new Sequelize("tarefas3D", "root", "root", {
//   host: "localhost",
//   dialect: "mysql",
//   port: "3306",
// });

export const conn = new Sequelize({
  dialect: "sqlite",
  storage: "./dev.sqlite",
});

//testar conexão
// try {
//     await conn.authenticate()
//     console.log("MYSQL conectado com sucesso")
// } catch (error) {
//     console.log("Erro ao conectar: ",error)
// }

// export default conn;
