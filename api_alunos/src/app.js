import express, { request } from 'express';
import cors from 'cors';

import { Sequelize } from 'sequelize';  
import conn from './sequelize.js'; 
import alunosTabela from './alunosTabela.js';

const PORT = 3333;

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());
//estabelecer conexão e criar tabelas 
conn.sync()
.then(() => { app.listen(PORT, () => {
  console.log(`Server http is running on PORT: ${PORT}`);
}); 
})
.catch((error)=> console.log(error))

const logRoutes = (request, response, next) => {
  const {url, method} = request
  const rota = `[${method}] ${url}`
  console.log(rota);
  next();
}

//Middleware global
app.use(logRoutes);

app.get('/alunos', async (request, response) => {
   try {
        const alunos = await alunosTabela.findAll()
        response.status(200).json(alunos);
    } catch (error){
        response.status(500).json({erro: 'Erro ao listar alunos'});
    }
});

app.post("/alunos", async (request, response) => {
    const {ra, nome, email} = request.body;

    if(!nome){
        response.status(400).json({erro: 'Campo nome inválido',
            mensagem: 'O campo nome é obrigatório'
        })
        return;
    }
    if (!ra) {
        response.status(400).json({erro: 'Campo ra inválido',
            mensagem: 'O campo ra é obrigatório.'
        })
        return;
    }
    if (!email) {
        response.status(400).json({erro: 'Campo email inválido',
            mensagem: 'O campo email é obrigatório.'
        })
        return;
    }

    const novoAluno = {
       nome,
       ra,
        email
    }

    try {
        const alunoCadastrado = await alunosTabela.create(novoAluno)
        response.status(201).json({mensagem: 'Aluno cadastrado com sucesso!', alunoCadastrado});
    } catch (error) {
        response.status(500).json({erro: 'Erro ao cadastrar aluno',});
    }
})

app.get("/alunos/:id", async (request, response) => {
  const { id } = request.params;

  if (!id) {
    return response.status(400).json({ erro: 'Parâmetro ID inválido' });
  }

  try {
    const alunoSelecionado = await alunosTabela.findByPk(id);
    if (!alunoSelecionado) {
      return response.status(404).json({
        erro: 'aluno não encontrado',
        mensagem: `ID ${id} não existe`,
      });
    }
    response.status(200).json(alunoSelecionado);
  } catch (error) {
    response.status(500).json({ erro: 'Erro ao listar alunos' });
  }
});

app.put("/alunos/:id", async (request, response) => {
  const { id } = request.params;
  const { nome, ra, email } = request.body;

  if (!id) {
    return response.status(400).json({ erro: 'Parâmetro ID inválido' });
  }

  try {
    const alunoSelecionado = await alunosTabela.findByPk(id);
    if (!alunoSelecionado) {
      return response.status(404).json({
        erro: 'Aluno não encontrado',
        mensagem: `ID ${id} não existe`
      });
    }

    if (nome !== undefined) alunoSelecionado.nome = nome;
    if (ra !== undefined) alunoSelecionado.ra = ra;
    if (email !== undefined) alunoSelecionado.email = email;

    await alunoSelecionado.save(); 

    response.status(200).json({
      mensagem: 'Aluno atualizado com sucesso',
      aluno: alunoSelecionado
    });
  } catch (error) {
    console.log(error); 
    response.status(500).json({ erro: 'Erro ao atualizar aluno' });
  }
});

app.delete("/alunos/:id", async (request, response) => {
  const { id } = request.params;
  
  if (!id) {
    return response.status(400).json({ erro: 'Parâmetro ID inválido' });
  }

  try {
    const alunoSelecionado = await alunosTabela.findByPk(id);
    
    if (!alunoSelecionado) {
      return response.status(404).json({
        erro: 'Aluno não encontrado',
        mensagem: `ID ${id} não existe`
      });
    }

    await alunosTabela.destroy({
      where: { id: alunoSelecionado.id }
    });

    response.status(204).send(); 
  } catch (error) {
    console.log(error); 
    response.status(500).json({ erro: 'Erro interno ao deletar aluno' });
  }
});

//middlewares 
app.use((request, response) => {
    response.status(404).json({mensagem: 'Rota não encontrada!'})
})

