import express from 'express';
import {conn} from './conn.js';

//Tabelas
import Usuario from './model/usuario.js';
import Perfil from './model/perfil.js';
import Publicacao from './model/publicacao.js';
import comentario from './model/comentario.js';

const PORT = 3333;

const app = express();

conn.sync();
//{force: true}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});