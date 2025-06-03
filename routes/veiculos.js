
import express from 'express';
import {
  criarVeiculo,
  listarVeiculos,
  deletarVeiculo
} from '../services/veiculos.js';

const router = express.Router();

router.post('/', criarVeiculo);         // POST /api/veiculos
router.get('/', listarVeiculos);        // GET /api/veiculos
router.delete('/:id', deletarVeiculo);  // DELETE /api/veiculos/:id

export default router;
