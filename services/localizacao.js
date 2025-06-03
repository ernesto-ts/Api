
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function salvarLocalizacao({ usuarioId, nome, lat, lng, timestamp }) {
  return await prisma.localizacao.upsert({
    where: { usuarioId },
    update: { nome, lat, lng, timestamp: new Date(timestamp) },
    create: { usuarioId, nome, lat, lng, timestamp: new Date(timestamp) },
  });
}

export async function buscarLocalizacao(usuarioId) {
  return await prisma.localizacao.findUnique({
    where: { usuarioId },
  });
}
