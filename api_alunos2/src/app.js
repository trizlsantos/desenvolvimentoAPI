import express from "express";
import cors from "cors";

import { conn } from "./sequelize.js";

//Tabelas
import tabelaResponsaveis from "./tabelaResponsaveis.js";
import alunosTabela from "./alunosTabela.js";
import "./relacionamentos.js"; 
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
    const {url, method} = request
    const rota = `[${method.toUpperCase()}] - ${url}`
    console.log(rota)
    next()
  }


//Middleware GLOBAL
app.use(logRoutes)

 app.get('/alunos', async (req, res) => {
  try {
    const alunos = await alunosTabela.findAll();
    res.status(200).json(alunos);
  } catch (error) {
    console.error("Erro ao listar alunos:", error); 
    res.status(500).json({ erro: 'Erro ao listar alunos' });
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

app.get("/responsaveis", async (request, response) => {
     try {
        const responsaveis = await tabelaResponsaveis.findAll()
        response.status(200).json(responsaveis);
    } catch (error){
        response.status(500).json({erro: 'Erro ao listar responsáveis', error});
    }
});

app.post("/responsaveis", async (request, response) => {
    const {nome, idade, email, senha, telefone, grau_parentesco, endereco, dt_nascimento } = request.body;

    if(!nome){
        response.status(400).json({erro: 'Campo nome inválido',
            mensagem: 'O campo nome é obrigatório'
        })
        return;
    }
    if (!idade) {
        response.status(400).json({erro: 'Campo inválido',
            mensagem: 'O campo é obrigatório.'
        })
        return;
    }
    if (!email) {
        response.status(400).json({erro: 'Campo email inválido',
            mensagem: 'O campo email é obrigatório.'
        })
        return;
    }
     if (!senha) {
        response.status(400).json({erro: 'Campo inválido',
            mensagem: 'O campo é obrigatório.'
        })
        return;
    }
     if (!telefone) {
        response.status(400).json({erro: 'Campo inválido',
            mensagem: 'O campo é obrigatório.'
        })
        return;
    }
     if (!grau_parentesco) {
        response.status(400).json({erro: 'Campo inválido',
            mensagem: 'O campo é obrigatório.'
        })
        return;
    }
     if (!endereco) {
        response.status(400).json({erro: 'Campo inválido',
            mensagem: 'O campo é obrigatório.'
        })
        return;
    }
     if (!dt_nascimento) {
        response.status(400).json({erro: 'Campo inválido',
            mensagem: 'O campo é obrigatório.'
        })
        return;
    }
    const novoResponsavel = {
      nome, 
      idade,
      email, 
      senha,
      telefone,
      grau_parentesco, 
      endereco, 
      dt_nascimento
    }

    try {
        const responsavelCadastrado = await tabelaResponsaveis.create(novoResponsavel)
        response.status(201).json({mensagem: 'responsável cadastrado com sucesso!', responsavelCadastrado})
    } catch (error) {
    console.error("Erro ao cadastrar responsável:", error);
    response.status(500).json({ erro: 'Erro ao cadastrar responsavel' });
}
})

app.get("/responsaveis/:id", async (request, response) => {
      const { id } = request.params;

  if (!id) {
    return response.status(400).json({ erro: 'Parâmetro ID inválido' });
  }

  try {
    const responsavelSelecionado = await tabelaResponsaveis.findByPk(id);
    if (!responsavelSelecionado) {
      return response.status(404).json({
        erro: 'responsavel não encontrado',
        mensagem: `ID ${id} não existe`,
      });
    }
    response.status(200).json(responsavelSelecionado);
  } catch (error) {
    response.status(500).json({ erro: 'Erro ao listar responsaveis' });
  }
});

app.put("/responsaveis/:id", async (request, response) => {
    const { id } = request.params;
  const { nome, idade, email, senha, telefone, grau_parentesco, endereco, dt_nascimento } = request.body;

  if (!id) {
    return response.status(400).json({ erro: 'Parâmetro ID inválido' });
  }
  if(!nome){
        response.status(400).json({erro: 'Campo nome inválido',
            mensagem: 'O campo nome é obrigatório'
        })
        return;
    }
    if (!idade) {
        response.status(400).json({erro: 'Campo inválido',
            mensagem: 'O campo é obrigatório.'
        })
        return;
    }
    if (!email) {
        response.status(400).json({erro: 'Campo email inválido',
            mensagem: 'O campo email é obrigatório.'
        })
        return;
    }
     if (!senha) {
        response.status(400).json({erro: 'Campo inválido',
            mensagem: 'O campo é obrigatório.'
        })
        return;
    }
     if (!telefone) {
        response.status(400).json({erro: 'Campo inválido',
            mensagem: 'O campo é obrigatório.'
        })
        return;
    }
     if (!grau_parentesco) {
        response.status(400).json({erro: 'Campo inválido',
            mensagem: 'O campo é obrigatório.'
        })
        return;
    }
     if (!endereco) {
        response.status(400).json({erro: 'Campo inválido',
            mensagem: 'O campo é obrigatório.'
        })
        return;
    }
     if (!dt_nascimento) {
        response.status(400).json({erro: 'Campo inválido',
            mensagem: 'O campo é obrigatório.'
        })
        return;
    }

  try {
    const responsavelSelecionado = await tabelaResponsaveis.findByPk(id);
    if (!responsavelSelecionado) {
      return response.status(404).json({
        erro: 'responsavel não encontrado',
        mensagem: `ID ${id} não existe`
      });
    }

    if (nome !== undefined) responsavelSelecionado.nome = nome;
    if (idade !== undefined) responsavelSelecionado.idade = idade;
    if (email !== undefined) responsavelSelecionado.email = email;
    if (senha !== undefined) responsavelSelecionado.senha = senha;
    if (telefone !== undefined) responsavelSelecionado.telefone = telefone;
    if (grau_parentesco !== undefined) responsavelSelecionado.grau_parentesco = grau_parentesco;
    if (endereco !== undefined) responsavelSelecionado.endereco = endereco;
    if (dt_nascimento !== undefined) responsavelSelecionado.dt_nascimento = dt_nascimento;
    

    await responsavelSelecionado.save(); 

    response.status(200).json({
      mensagem: 'responsavel atualizado com sucesso',
      aluno: responsavelSelecionado
    });
  } catch (error) {
    console.log(error); 
    response.status(500).json({ erro: 'Erro ao atualizar responsavel' });
  }
});
app.delete("/responsaveis/:id", async (request, response) => {
     const { id } = request.params;
  
  if (!id) {
    return response.status(400).json({ erro: 'Parâmetro ID inválido' });
  }

  try {
    const responsavelSelecionado = await tabelaResponsaveis.findByPk(id);
    
    if (!responsavelSelecionado) {
      return response.status(404).json({
        erro: 'responsavel não encontrado',
        mensagem: `ID ${id} não existe`, error
      });
    }

    await tabelaResponsaveis.destroy({
      where: { id: responsavelSelecionado.id }
    });

    response.status(204).send(); 
  } catch (error) {
    console.log(error); 
    response.status(500).json({ erro: 'Erro interno ao deletar responsavel' });
  }
});
