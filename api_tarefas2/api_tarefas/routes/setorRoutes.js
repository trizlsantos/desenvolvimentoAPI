import { Router } from 'express';
import tarefaModel from '../src/models/tarefaModel.js';

const router = Router();

//app.js -> http://localhost:3333/setores
router.get("/setores", async (request, response) => {
  try {
    const setores = await tabelaSetor.findAll();
    response.status(200).json(setores);
  } catch (error) {
    console.log(error);
    response.status(500).json({ mensagem: "Erro interno ao listar setores" });
  }
});
router.post("/setores", async (request, response) => {
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
router.get("/setores/:id", async (request, response) => {
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
router.put("/setores/:id", async (request, response) => {
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
router.delete("/setores/:id", async (request, response) => {
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

export default router;