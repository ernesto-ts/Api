import express from 'express';
import { inscreverUsuarioNaLinha } from '../services/InscricaoService.js';

const router = express.Router();

// Rota para usuário se inscrever em uma linha
router.post('/linhas/:id/inscrever', inscreverUsuarioNaLinha);

export default router;
