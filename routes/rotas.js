
import express from 'express';
import { criarRotas, listarRotas, deletarRota, listarPontosDaRota } from '../services/rotas.js';

const router = express.Router();

router.post('/rotas', criarRotas);
router.get('/rotas', listarRotas);
router.delete('/rotas/:id', deletarRota);
router.get('/rotas/:id/pontos', listarPontosDaRota);

export default router;
