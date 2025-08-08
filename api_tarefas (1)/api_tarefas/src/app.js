import express from "express";
import cors from "cors";

import { conn } from "./sequelize.js";

//Tabelas
import tabelaSetor from "./setorTabela.js";
import tabelaTarefa from "./tarefaTabela.js";

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

//middleware LOCAL -> NA ROTA
app.get("/tarefas", logRoutes, async (request, response) => {
  try {
    const tarefas = await tabelaTarefa.findAll();
    response.status(200).json(tarefas);
  } catch (error) {
    response.status(500).json({
      erro: "Erro interno ao listar tarefas",
    });
  }
});
app.post("/tarefas", async (request, response) => {
  const { tarefa, descricao, setor_id } = request.body;

  if (!tarefa || tarefa.length < 2) {
    response.status(400).json({
      erro: "Campo tarefa inválido",
      mensagen: "O campo tarefa deve ter 2 ou mais caracteres",
    });
    return;
  }
  if (!descricao) {
    response.status(400).json({
      erro: "Campo descricao inválido",
      mensagen: "O descricao não pode ser nulo",
    });
    return;
  }

  if (!setor_id) {
    response.status(400).json({
      erro: "Campo setor_id inválido",
      mensagen: "O setor_id não pode ser nulo",
    });
    return;
  }

  const novaTarefa = {
    tarefa,
    descricao,
    setor_id,
  };

  try {
    const verificaSetorExiste = await tabelaSetor.findByPk(setor_id);

    if (!verificaSetorExiste) {
      response.status(404).json({
        erro: "Setor inválido",
        mensagem: "Setor não existe no sistema",
      });
      return;
    }

    const tarefaCadastrada = await tabelaTarefa.create(novaTarefa);
    response.status(201).json({
      mensagem: "Tarefa cadastrada com sucesso",
      tarefaCadastrada,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      erro: "Erro interno ao cadastrar tarefa",
    });
  }
});
app.get("/tarefas/:id", async (request, response) => {
  //listar um tarefa .findOne .findByPk
  const { id } = request.params;

  if (!id) {
    response.status(400).json({
      erro: "Parâmetro id Inválido",
    });
    return;
  }

  try {
    const tarefaSelecionada = await tabelaTarefa.findByPk(id);
    if (!tarefaSelecionada) {
      response.status(404).json({
        erro: "Tarefa não encontrada",
        mensagem: `ID ${id} não existe`,
      });
      return;
    }
    response.status(200).json(tarefaSelecionada);
  } catch (error) {
    response.status(500).json({
      erro: "Erro interno ao listar uma tarefa",
    });
  }
});
app.put("/tarefas/:id", async (request, response) => {
  const { id } = request.params;
  const { tarefa, descricao, situacao, setor_id } = request.body;

  if (!id) {
    response.status(400).json({
      erro: "Parâmetro id Inválido",
    });
    return;
  }

  if (!setor_id) {
    response.status(400).json({
      erro: "Campo setor_id inválido",
      mensagem: "Setor é obrigatório",
    });
    return;
  }

  try {
    const verificaSetorExiste = await tabelaSetor.findByPk(setor_id);
    if (!verificaSetorExiste) {
      response.status(404).json({
        erro: "Setor inválido",
        mensagem: "Setor não existe no sistema",
      });
      return;
    }

    const tarefaSelecionada = await tabelaTarefa.findByPk(id);
    if (!tarefaSelecionada) {
      response.status(404).json({
        erro: "Tarefa não encontrada",
        mensagem: `ID ${id} não existe`,
      });
      return;
    }

    //Salvar somente as informações que o usuário mandar
    if (tarefa !== undefined) {
      tarefaSelecionada.tarefa = tarefa;
    }
    if (descricao !== undefined) {
      tarefaSelecionada.descricao = descricao;
    }
    if (situacao !== undefined) {
      tarefaSelecionada.situacao = situacao;
    }
    await tarefaSelecionada.save();
    response.status(200).json({
      mensagem: "Tarefa atualizada",
      tarefa: tarefaSelecionada,
    });
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ mensagem: "Error interno ao atualizar tarefa" });
  }
});
app.delete("/tarefas/:id/:setorId", async (request, response) => {
  const { id, setorId } = request.params;
  if (!id) {
    response.status(400).json({ mensagem: "ID Parâmetro inválido" });
    return;
  }

  if (!setorId) {
    response.status(400).json({ mensagem: "setorId Parâmetro inválido" });
    return;
  }

  try {
    const tarefaSelecionada = await tabelaTarefa.findByPk(id); //{id, tarefa, descricao, sit, dtC, dtU} || null
    if (!tarefaSelecionada) {
      response.status(404).json({
        erro: "Tarefa não encontrada",
        mensagem: `ID ${id} não existe no banco`,
      });
      return;
    }

    const deletaTarefa = await tabelaTarefa.destroy({
      where: { id: tarefaSelecionada.id, setor_id: setorId },
    });

    if (deletaTarefa === 0) {
      response.status(404).json({
        erro: "erro ao deletar atividade",
        mensagem: "Atividade não pertence ao setor",
      });
      return;
    }

    response.status(204).send();
  } catch (error) {
    console.log(error);
    response.status(500).json({
      erro: "Erro interno ao deletar uma tarefa",
    });
  }
});

//**************ROTAS DE SETOR *************/
app.get("/setores", async (request, response) => {
  try {
    const setores = await tabelaSetor.findAll();
    response.status(200).json(setores);
  } catch (error) {
    console.log(error);
    response.status(500).json({ mensagem: "Erro interno ao listar setores" });
  }
});
app.post("/setores", async (request, response) => {
  const { nome } = request.body;
  if (!nome) {
    response.status(400).json({ mensagem: "Campo nome é obrigatório" });
    return;
  }

  try {
    const setorCriado = await tabelaSetor.create({ nome });
    response.status(201).json(setorCriado);
  } catch (error) {
    console.log(error);
    response.status(500).json({ mensagem: "Erro interno ao Cadastrar setor" });
  }
});
app.get("/setores/:id", async (request, response) => {
  const { id } = request.params;

  if (!id) {
    response.status(400).json({ mensagem: "id inválido" });
    return;
  }

  try {
    const setorSelecionado = await tabelaSetor.findByPk(id);
    if (!setorSelecionado) {
      response.status(404).json({ mensagem: "Setor não identificado" });
      return;
    }

    response.status(200).json(setorSelecionado);
  } catch (error) {
    console.log(error);
    response.status(500).json({ mensagem: "Erro interno ao Cadastrar setor" });
  }
});
app.put("/setores/:id", async (request, response) => {
  const { id } = request.params;
  const { nome } = request.body;

  if (!id) {
    response.status(400).json({ mensagem: "id inválido" });
    return;
  }

  try {
    const setorSelecionado = await tabelaSetor.findByPk(id);
    if (!setorSelecionado) {
      response.status(404).json({ mensagem: "Setor não identificado" });
      return;
    }

    if (nome !== undefined) {
      setorSelecionado.nome = nome;
    }

    await setorSelecionado.save();
    response.status(200).json({ mensagem: "Setor atualizado com sucesso" });
  } catch (error) {
    console.log(error);
    response.status(500).json({ mensagem: "Erro interno ao Cadastrar setor" });
  }
});
app.delete("/setores/:id", async (request, response) => {
  const { id } = request.params;

  if (!id) {
    response.status(400).json({ mensagem: "id inválido" });
    return;
  }

  try {
    const setorSelecionado = await tabelaSetor.findByPk(id);
    if (!setorSelecionado) {
      response.status(404).json({ mensagem: "Setor não identificado" });
      return;
    }

    await tabelaSetor.destroy({
      where: { id: setorSelecionado.id },
    });

    response.status(204).send();
  } catch (error) {
    console.log(error);
    response.status(500).json({ mensagem: "Erro interno ao Excluir setor" });
  }
});

//ROTAS EXTRAS
//Listar todas a tarefas pendentes/Concluídas
app.get("/tarefas/situacao/:situacao", async (request, response) => {
  const situacao = request.params.situacao;
  if (!situacao) {
    response.status(400).json({ mensagem: "situação inválida" });
  }

  try {
    const tarefas = await tabelaTarefa.findAll({
      where: {
        situacao,
      },
    });

    response.status(200).json(tarefas);
  } catch (error) {
    console.log(error);
    response.status(500).json({ mensagem: "Erro interno ao listar tarefas" });
  }
});
//Listar tarefas vinculadas a setor
app.get("/setores/:id/tarefas", async (request, response) => {
  const { id } = request.params;
  
  if(!id){
    response.status(400).json({mensagem: "ID inválido"})
    return
  }

  try {
    const tarefasSetor = await tabelaTarefa.findAll({
      where: {
        setor_id: id
      }
    })
    response.status(200).json(tarefasSetor)
  } catch (error) {
    console.log(error)
    response.status(500).json({mensagem:"Erro interno ao listar tarefas"})
  } 
});

//middlewares
app.use((request, response) => {
  response.status(404).json({
    erro: "Erro de Rota",
    mensagem: "Rota não encontrada",
  });
});
