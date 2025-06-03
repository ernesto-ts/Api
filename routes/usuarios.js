
import express from 'express';
import { PrismaClient } from '@prisma/client';
import {
  criarUsuario,
  listarUsuarios,
  atualizarUsuario,
  deletarUsuario,
} from '../services/usuarios.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', criarUsuario);
router.get('/', listarUsuarios);
router.put('/:id', atualizarUsuario);
router.delete('/:id', deletarUsuario);

router.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Erro no servidor', error: err.message });
  }
});

export default router;  
