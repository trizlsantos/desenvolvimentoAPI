// Instruções para conectar com o banco de dado
import { Sequelize } from 'sequelize';

                            //Banco     //user   //Senha
export const conn = new Sequelize('tarefas3D', 'root', '123456789', {
    host: 'localhost',
    dialect: 'mysql',
    port: "3306"
})

//testar conexão
/* try{
    await conn.authenticate();
    console.log('MYSQL conectado com sucesso')
} catch(error){
    console.error('Erro ao conectar: ', error);
}
    */

export default conn; 