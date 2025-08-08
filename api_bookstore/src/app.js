import express from 'express';
import cors from 'cors';
import { conn } from './config/sequelize.js';

//Tabelas
import autorModel from './models/autorModel.js';

//Rotas
import autorRoutes from './routes/autorRoutes.js'

const app = express();

app.use(cors({
    origin: '*',
    methods: ['get', 'post', 'put', 'patch', 'delete'],
    credentials: true
}));
app.use(express.json());

conn
     .sync()
     .then(() => console.log('Bando de dados conectado'))
     .catch((error) => console.log(error));

app.use("/api", autorRoutes)

app.get('/', (request, response) => {
    response.status(200).json({mensagem: "Olá, mundo!"});
});

export default app;