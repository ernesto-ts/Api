
import express from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import {
  loginMotorista,
  criarMotorista,
  listarMotoristas,
  deletarMotorista,
  buscarMotoristaPorEmail
} from '../services/motoristas.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/motoristas/login', loginMotorista);
router.post('/motoristas', criarMotorista);
router.get('/motoristas', listarMotoristas);
router.delete('/motoristas/:id', deletarMotorista);
router.get('/motoristas/:email', buscarMotoristaPorEmail);

export default router;
