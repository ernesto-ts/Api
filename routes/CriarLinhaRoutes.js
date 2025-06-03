import express from 'express';
import { PrismaClient } from '@prisma/client';
import { criarLinha, getLinhaPorId, listarLinhas,listarUsuariosDaLinha, listarUsuariosPorLinha , buscarLinhasDoUsuario, buscarLinhaPorMotorista} from '../services/CriarLinhaService.js';

const prisma = new PrismaClient();
const router = express.Router();

// Rota para criar uma nova linha (admin)
router.post('/criar-linha', criarLinha);
router.get('/:id', getLinhaPorId); 
router.get('/', listarLinhas);
router.get('/motorista/:motoristaId', buscarLinhaPorMotorista);
router.get('/usuario/:usuarioId', buscarLinhasDoUsuario);
router.get('/:id/usuarios', listarUsuariosDaLinha);

export default router;
