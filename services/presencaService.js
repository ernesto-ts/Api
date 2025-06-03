import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export const registrarPresenca = async (req, res) => {
  const { linhaId, usuarioId } = req.body;

  if (!linhaId || !usuarioId) {
    return res.status(400).json({ error: "linhaId e usuarioId são obrigatórios." });
  }

  try {
    const presenca = await prisma.presenca.create({
      data: {
        linhaId,
        usuarioId,
      },
    });

    return res.status(201).json(presenca);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao registrar presença...." });
  }
};

export const encerrarViagem = async (req, res) => {
  const { viagemId } = req.body;

  if (!viagemId) {
    return res.status(400).json({ error: "viagemId é obrigatório." });
  }

  try {
    // 1. Encerrar a linha
    const linhaEncerrada = await prisma.linha.update({
      where: { id: viagemId },
      data: { encerrada: true },
    });

    // 2. Validar todas as presenças associadas à linha
    await prisma.presenca.updateMany({
      where: { linhaId: viagemId },
      data: { validado: true },
    });

    return res.status(200).json({
      message: "Viagem encerrada e presenças validadas.",
      linha: linhaEncerrada,
    });
  } catch (err) {
    console.error("Erro ao encerrar viagem:", err);
    return res.status(500).json({ error: "Erro ao encerrar a viagem." });
  }
};

export const getPresencasPorLinha = async (req, res) => {
  const { linhaId } = req.params;
  try {
    const presencas = await prisma.presenca.findMany({
      where: { linhaId },
      include: {
        usuario: true,
      },
    });

    res.json(presencas); // <-- deve retornar um array diretamente
  } catch (err) {
    console.error("Erro ao buscar presenças:", err);
    res.status(500).json({ error: "Erro ao buscar presenças." });
  }
};

