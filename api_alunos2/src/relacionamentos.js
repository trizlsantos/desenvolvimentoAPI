import alunosTabela from "./alunosTabela.js";
import tabelaResponsaveis from "./tabelaResponsaveis.js";

tabelaResponsaveis.hasMany(alunosTabela, {
  foreignKey: "responsavel_id",
  as: "alunos"
});

alunosTabela.belongsTo(tabelaResponsaveis, {
  foreignKey: "responsavel_id",
  as: "responsavel"
});