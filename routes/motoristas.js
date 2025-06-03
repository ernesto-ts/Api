
import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import {
  criarMotorista,
  listarMotoristas,
  deletarMotorista
} from '../services/motoristas.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/motoristas', criarMotorista);
router.get('/motoristas', listarMotoristas);
router.delete('/motoristas/:id', deletarMotorista);

// Rota de login do motorista
router.post('/motoristas/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const motorista = await prisma.Driver.findUnique({
      where: { email },
    });

    if (!motorista) {
      return res.status(401).json({ message: 'Motorista não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, motorista.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = 'token_motorista_exemplo'; 
    res.status(200).json({ token });

  } catch (error) {
    console.error("Erro ao fazer login do motorista:", error); 
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
});


router.get('/motoristas/:email', async (req, res) => {
  const { email } = req.params; 
  console.log("Buscando motorista com email:", email);  

  try {
    const motorista = await prisma.Driver.findUnique({
      where: { email }, 
    });

    if (!motorista) {
      console.log("Motorista não encontrado");  
      return res.status(404).json({ message: "Motorista não encontrado" });
    }

    console.log("Motorista encontrado:", motorista);  
    res.json(motorista);
  } catch (error) {
    console.error("Erro ao buscar motorista:", error);  
    res.status(500).json({ message: "Erro ao buscar motorista", error: error.message });
  }
});




export default router;
