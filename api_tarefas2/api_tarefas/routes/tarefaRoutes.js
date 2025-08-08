import { Router } from 'express';
import setorModel from '../src/models/setorModel.js';
import tarefaModel from '../src/models/tarefaModel.js';

const router = Router();

router.get("/", async (request, response) => {
  try {
    const tarefas = await tabelaTarefa.findAll();
    response.status(200).json(tarefas);
  } catch (error) {
    response.status(500).json({
      erro: "Erro interno ao listar tarefas",
    });
  }
});
router.post("/", async (request, response) => {
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
router.get("/:id", async (request, response) => {
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
router.put("/:id", async (request, response) => {
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
router.delete("/:id/:setorId", async (request, response) => {
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
//Listar todas a tarefas pendentes/Concluídas
router.get("/situacao/:situacao", async (request, response) => {
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

export default router;