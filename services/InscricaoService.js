// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
import prisma from "../node_modules/@prisma/client/default.js";

export async function inscreverUsuarioNaLinha(req, res) {
  const { usuarioId, linhaId } = req.body;

  console.log("Dados recebidos para inscrição:", { usuarioId, linhaId });

  if (!usuarioId || !linhaId) {
    return res.status(400).json({ erro: 'Usuário e Linha são obrigatórios' });
  }

  try {
    const jaInscrito = await prisma.usuarioNaLinha.findFirst({
      where: { usuarioId, linhaId },
    });

    if (jaInscrito) {
      return res.status(400).json({ erro: 'Usuário já inscrito nessa linha' });
    }

    const inscricao = await prisma.usuarioNaLinha.create({
      data: {
        usuarioId,
        linhaId,
      },
    });

    res.status(201).json({ mensagem: 'Usuário inscrito com sucesso', inscricao });
  } catch (error) {
    console.error('Erro ao inscrever usuário:', error);
    res.status(500).json({ erro: 'Erro ao inscrever usuário na linha' });
  }
}
