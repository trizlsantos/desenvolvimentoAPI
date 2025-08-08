import { Router } from "express";
import { cadastrarAutor, listarTodosAutores } from "../controllers/autorController.js";

const router = Router();

router.post("/autores", cadastrarAutor);
router.get("/autores", listarTodosAutores);

export default router;