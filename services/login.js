//import { PrismaClient } from '@prisma/client';
import prisma from "../node_modules/@prisma/client/default.js";

import bcrypt from 'bcrypt';

//const prisma = new PrismaClient();
//USUARIO TA FAZENDO LOGIN AQUI
export const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }
    const token = 'seu_token_aqui';

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};

