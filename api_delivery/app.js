import express from 'express';
import {conn} from './conn.js';

//Tabelas
import usuarios from './model/usuarios.js';
import restaurante from './model/restaurante.js';
import pedidos from './model/pedidos.js';
import entregador from './model/entregador.js';
import avaliacao from './model/avaliacao.js';
import entrega from './model/entrega.js';
import Produtos from './model/produtos.js';

const PORT = 3333;

const app = express();

conn.sync();
//{force: true}

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
