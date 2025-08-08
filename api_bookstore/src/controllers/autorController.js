import { response } from "express";
import autorModel  from "../models/autorModel.js";

export const cadastrarAutor = async (request, response) => {
    const { nome, biografia, data_nascimento, nacionalidade } = request.body;

    if(!nome){
        response.status(400).json({
            erro:"Campo nome incorreto",
            mensagem: "nome não pode ser nulo"
        })
        return
    }
    if(!biografia){
        response.status(400).json({
            erro:"Campo biografia incorreto",
            mensagem: "biografia não pode ser nulo"
        })
        return
    }
    if(!data_nascimento){
        response.status(400).json({
            erro:"Campo data_nascimento incorreto",
            mensagem: "data_nascimento  não pode ser nulo"
        })
        return
    }
    if(!nacionalidade){
        response.status(400).json({
            erro:"Campo nacionalidade incorreto",
            mensagem: "nacionalidade não pode ser nulo"
        })
        return
    }

    // 1992-02-18
    // 25-12-2009 - 2025-30-80 Date()
    const  validaData = new Date(data_nascimento)
    if(validaData == 'Invalid Date'){
        response.status(400).json({
            erro: "Data inválida",
            mensagem: "Formato da data inválido"
        })
        return
    }

    const autor = {
        nome,
        biografia, 
        data_nascimento, 
        nacionalidade
    }
    try {
        const novoAutor = await autorModel.create(autor)
        response.status(201).json({mensagem: "autor cadastrado com sucesso", novoAutor})
    } catch (error) {
        console.log(error)
        response.status(500).json({mensagem: "Erro interno do servidor ao casdastrar autor"})
    }
};

export const listarTodosAutores = async (request, response) => {
    const page = parseInt(request.query.page)  || 1
    const limit = parseInt(request.query.limit) || 10
    const offset = (page - 1) * limit

    console.log(page, limit)
    response.send()
    try {
       const autores = await autorModel.findAndCountAll({
        offset, 
        limit
       }) 
       console.log("Total: ", autores.count)
       console.log("Dados: " , autores.rows)

       const totalPaginas = 13
       response.status(200).json({
        totalAutores: autores.count,
        totalPaginas,
        paginaAtual: page,
        autoresPorPagina: limit,
        autores: autores.rows
       })
    } catch (error) {
        console.log(error)
        response.status(500).json({ mensagem: "Erro interno no servidor ao listar autores"})
        
    }
}