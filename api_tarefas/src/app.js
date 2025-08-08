import express from "express";
import cors from "cors";

import { conn } from "./sequelize.js";

//Tabelas
import tabelaTarefa from "./tarefaTabela.js";
import tabelaSetor from "./setorTabela.js";

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

//middleware LOCAL -> NA ROTA

// **********ROTAS DE TAREFA**********
app.get("/tarefas", async (req, res) => {
  try {
    const tarefas = await tabelaTarefa.findAll({
      include: {
        model: tabelaSetor,
        as: "setor", 
        attributes: ["id", "nome"],
      },
    });

    if (!tarefas || tarefas.length === 0) {
      return res.status(200).json({
        mensagem: "Nenhuma tarefa encontrada",
        tarefas: [],
      });
    }

    res.status(200).json(tarefas);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    res.status(500).json({ erro: "Erro ao listar tarefas" });
  }
});

app.post("/tarefas", async (request, response) => {
  const { tarefa, descricao, setorId } = request.body;

  if (!tarefa || tarefa.length < 2) {
    return response.status(400).json({ erro: "Campo tarefa inválido" });
  }

  if (!descricao) {
    return response.status(400).json({ erro: "Campo descrição inválido" });
  }

  const setor = await tabelaSetor.findByPk(setorId);
  if (!setor) {
    return response.status(400).json({ erro: `Setor ID ${setorId} não encontrado` });
  }

  try {
    const novaTarefa = await tabelaTarefa.create({
      tarefa,
      descricao,
      setorId, 
      situacao: "pendente",
    });

    response.status(201).json({ mensagem: "Tarefa criada", novaTarefa });
  } catch (error) {
    console.error(error); 
    response.status(500).json({ erro: "Erro ao cadastrar tarefa" });
  }
});

app.get("/tarefas/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  try {
    const tarefa = await tabelaTarefa.findByPk(id, {
      include: { model: tabelaSetor, attributes: ["id", "nome"] },
    });

    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.status(200).json(tarefa);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar tarefa" });
  }
});

app.put("/tarefas/:id", async (req, res) => {
  const { id } = req.params;
  const { tarefa, descricao, situacao, setorId } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  try {
    const tarefaSelecionada = await tabelaTarefa.findByPk(id);
    if (!tarefaSelecionada) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    if (setorId) {
      const setor = await tabelaSetor.findByPk(setorId);
      if (!setor) {
        return res.status(400).json({ erro: "Setor inválido" });
      }
      tarefaSelecionada.setorId = setorId;
    }

    if (tarefa !== undefined) tarefaSelecionada.tarefa = tarefa;
    if (descricao !== undefined) tarefaSelecionada.descricao = descricao;
    if (situacao !== undefined) tarefaSelecionada.situacao = situacao;

    await tarefaSelecionada.save();
    res.status(200).json({ mensagem: "Tarefa atualizada", tarefa: tarefaSelecionada });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar tarefa" });
  }
});

app.delete("/tarefas/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ erro: "ID inválido" });
  }

  try {
    const tarefa = await tabelaTarefa.findByPk(id);
    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    await tabelaTarefa.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ erro: "Erro ao deletar tarefa" });
  }
});

//Listar todas as tarefas pendentes/Concluídas
app.get("/tarefas/situacao/:situacao", async (req, res) => {
  const { situacao } = req.params;

  if (!["pendente", "concluido"].includes(situacao)) {
    return res.status(400).json({ erro: "Situação inválida. Use 'pendente' ou 'concluido'." });
  }

  try {
    const tarefas = await tabelaTarefa.findAll({
      where: { situacao },
      include: {
        model: tabelaSetor,
        as: "setor",
        attributes: ["id", "nome"],
      },
    });

    res.status(200).json(tarefas);
  } catch (error) {
    console.error("Erro ao buscar tarefas por situação:", error);
    res.status(500).json({ erro: "Erro ao buscar tarefas" });
  }
});

//Listar tarefas vinculadas a setor
app.get("/setor/:id/tarefas", async (req, res) => {
  const { id } = req.params;

  try {
    const setor = await tabelaSetor.findByPk(id, {
      include: {
        model: tabelaTarefa,
        as: "tarefas",
      },
    });

    if (!setor) {
      return res.status(404).json({ erro: "Setor não encontrado" });
    }

    res.status(200).json({
      setor: {
        id: setor.id,
        nome: setor.nome,
      },
      tarefas: setor.tarefas,
    });
  } catch (error) {
    console.error("Erro ao buscar tarefas do setor:", error);
    res.status(500).json({ erro: "Erro ao listar tarefas do setor" });
  }
});



// **********ROTAS DE SETOR**********
app.get("/setores", async (request, response) => {
   try {
        const setores = await tabelaSetor.findAll();
        response.status(200).json(setores);
    } catch (error){
        response.status(500).json({erro: 'Erro ao listar setores'});
    }
});

app.post("/setores", async (request, response) => {
  const {nome} = request.body;

    if (!nome) {
        response.status(400).json({erro: 'Campo nome inválido',
            mensagem: 'O campo nome é obrigatório.'
        })
        return;
    }

    const novoSetor = {
        nome
    }

    try {
        const setorCadastrado = await tabelaSetor.create(novoSetor);
        response.status(201).json({mensagem: 'setor cadastrado com sucesso!', setorCadastrado});
    } catch (error) {
        response.status(500).json({erro: 'Erro ao cadastrar setor',});
    }
});
app.get("/setores/:id", async (request, response) => {
    const { id } = request.params;

  if (!id) {
    return response.status(400).json({ erro: 'Parâmetro ID inválido' });
  }

  try {
    const setorSelecionado = await tabelaSetor.findByPk(id);
    if (!setorSelecionado) {
      return response.status(404).json({
        erro: 'setor não encontrado',
        mensagem: `ID ${id} não existe`,
      });
    }
    response.status(200).json(setorSelecionado);
  } catch (error) {
    response.status(500).json({ erro: 'Erro ao listar setores' });
  }
});

app.put("/setores/:id", async (request, response) => {
    const { id } = request.params;

  if (!request.body || typeof request.body !== 'object') {
    return response.status(400).json({ erro: 'Corpo da requisição inválido' });
  }

  const { nome, setor } = request.body;

  if (!id || isNaN(id)) {
    return response.status(400).json({ erro: 'Parâmetro ID inválido' });
  }

  try {
    const setorSelecionado = await tabelaSetor.findByPk(id);
    
    if (!setorSelecionado) {
      return response.status(404).json({
        erro: 'Setor não encontrado',
        mensagem: `ID ${id} não existe`,
      });
    }

    if (setor !== undefined) {
      setorSelecionado.setor = setor;
    }

    if (nome !== undefined) {
      setorSelecionado.nome = nome;
    }

    await setorSelecionado.save();

    return response.status(200).json({
      mensagem: 'Setor atualizado com sucesso',
      setor: setorSelecionado,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ erro: 'Erro ao atualizar setor' });
  }
});

app.delete("/setores/:id", async (request, response) => {
   const {id} = request.params;
  if (!id) {
    response.status(400).json({ erro: 'Parâmetro ID inválido' });
    return;
  }

  try {
   const setorSelecionado = await tabelaSetor.findByPk(id) 
   if (!setorSelecionado) { 
    response.status(404).json({
      erro: 'setor não encontrado',
      mensagem: `ID ${id} não existe`,
    });
    return;
   }

   await tabelaSetor.destroy({
    where: {id: setorSelecionado.id}
   })
   response.status(404).send()
  } catch (error) {
    response.status(500).json({ erro: 'Erro interno ao deletar um setor' });
  }
});

//middlewares
app.use((request, response) => {
  response.status(404).json({
    erro: "Erro de Rota",
    mensagem: "Rota não encontrada",
  });
});
