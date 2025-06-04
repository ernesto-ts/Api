import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const criarRotas = async (req, res) => {
  const { nome, pontos } = req.body;

  if (!nome || !Array.isArray(pontos) || pontos.length < 2) {
    return res.status(400).json({ error: 'A rota deve ter pelo menos 2 pontos.' });
  }

  try {
    const novaRota = await prisma.rota.create({
      data: {
        nome,
        pontos
      }
    });

    res.status(201).json(novaRota);
  } catch (error) {
    console.error('Erro ao salvar rota:', error);
    res.status(500).json({ error: error.message || 'Erro ao salvar rota' });
  }
};

export const listarRotas = async (req, res) => {
  try {
    const rotas = await prisma.rota.findMany();
    res.status(200).json(rotas);
  } catch (error) {
    console.error('Erro ao listar rotas:', error);
    res.status(500).json({ error: 'Erro ao listar rotas', details: error.message });
  }
};

export const deletarRota = async (req, res) => {
  const { id } = req.params;

  try {
    const rota = await prisma.rota.findUnique({
      where: { id },
    });

    if (!rota) {
      return res.status(404).json({ error: "Rota não encontrada" });
    }

    await prisma.rota.delete({
      where: { id },
    });

    res.json({ mensagem: "Rota deletada com sucesso!" });
  } catch (erro) {
    console.error("Erro ao deletar rota:", erro);
    res.status(500).json({ error: "Erro ao deletar rota." });
  }
};


//funcionando
export async function listarPontosDaRota(req, res) {
  const rotaId = req.params.id;

  try {
    const rota = await prisma.rota.findUnique({
      where: { id: rotaId },
      select: {
        pontos: true,
      },
    });

    if (!rota) {
      return res.status(404).json({ error: 'Rota não encontrada' });
    }
    const pontosFormatados = rota.pontos.map(p => ({
      lat: p.latitude,
      lng: p.longitude,
    }));

    res.json(pontosFormatados);
  } catch (error) {
    console.error('Erro ao buscar pontos da rota:', error);
    res.status(500).json({ error: 'Erro ao buscar pontos da rota' });
  }
}
