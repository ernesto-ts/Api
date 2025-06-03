import express from 'express';
import { criarRota, associarVeiculoARota, confirmarInteresse } from '../services/rotaService.js';

const router = express.Router();

// Criar Rota
router.post('/criar', async (req, res) => {
  const { nome, descricao, horario_inicio, horario_fim } = req.body;

  try {
    const novaRota = await criarRota(nome, descricao, horario_inicio, horario_fim);
    res.status(201).json(novaRota);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Associar Veículo à Rota
router.post('/associar-veiculo', async (req, res) => {
  const { rotaId, veiculoId } = req.body;

  try {
    const rotaAtualizada = await associarVeiculoARota(rotaId, veiculoId);
    res.status(200).json(rotaAtualizada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Confirmar Interesse do Usuário na Rota
router.post('/confirmar-interesse', async (req, res) => {
  const { rotaId } = req.body;
  const usuarioId = req.user.id;  // Supondo que o middleware autentique o usuário

  try {
    const rotaAtualizada = await confirmarInteresse(rotaId, usuarioId);
    res.status(200).json(rotaAtualizada);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
