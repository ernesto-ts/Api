import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const criarRota = async (nome, descricao, horario_inicio, horario_fim) => {
  try {
    const novaRota = await prisma.rota.create({
      data: {
        nome,
        descricao,
        horario_inicio: new Date(horario_inicio),
        horario_fim: new Date(horario_fim),
      },
    });
    return novaRota;
  } catch (error) {
    throw new Error('Erro ao criar rota');
  }
};

export const associarVeiculoARota = async (rotaId, veiculoId) => {
  try {
    const rotaAtualizada = await prisma.rota.update({
      where: { id: rotaId },
      data: {
        veiculos: {
          connect: { id: veiculoId },
        },
      },
    });
    return rotaAtualizada;
  } catch (error) {
    throw new Error('Erro ao associar veículo à rota');
  }
};

export const confirmarInteresse = async (rotaId, usuarioId) => {
  try {
    const rotaAtualizada = await prisma.rota.update({
      where: { id: rotaId },
      data: {
        lista_presenca: {
          connect: { id: usuarioId },
        },
      },
    });
    return rotaAtualizada;
  } catch (error) {
    throw new Error('Erro ao confirmar interesse');
  }
};
 