import express from 'express';
import { loginUsuario } from '../services/login.js';

const router = express.Router();

router.post('/usuarios/login', loginUsuario);

export default router; 
