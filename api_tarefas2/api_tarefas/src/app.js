import express from "express";
import cors from "cors";

import { conn } from "./sequelize.js";

//Tabelas
import setorModel from "./models/setorModel.js";
import tarefaModel from "./models/tarefaModel.js";


//ROTAS
import setorRoutes from './routes/setorRoutes.js';
import tarefaRoutes from './routes/tarefaRoutes.js';

const PORT = 3333;

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

//estabelecer conexão e criar as tabelas
conn
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server http is running on PORT:${PORT}`);
    });
  })
  .catch((error) => console.log(error));

const logRoutes = (request, response, next) => {
  const { url, method } = request;
  const rota = `[${method.toUpperCase()}] - ${url}`;
  console.log(rota);
  next();
};

//Middleware GLOBAL
app.use(logRoutes);

//Utilizando as ROTAS importadas
app.use('/setores', setorRoutes); //:3333/setores
app.use('/tarefas', tarefaRoutes);//:3333/tarefas

//middlewares
app.use((request, response) => {
  response.status(404).json({
    erro: "Erro de Rota",
    mensagem: "Rota não encontrada",
  });
});
