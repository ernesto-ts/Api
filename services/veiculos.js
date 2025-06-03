import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const criarVeiculo = async (req, res) => {
  try {
    const { tipo, marca, placa, lotacao } = req.body;

    const veiculo = await prisma.vehicle.create({
      data: {
        tipo,
        marca,
        placa,
        lotacao,
      },
    });

    res.status(201).json(veiculo);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar veículo', details: error.message });
  }
};

export const listarVeiculos = async (req, res) => {
  try {
    const veiculos = await prisma.vehicle.findMany();
    res.status(200).json(veiculos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar veículos', details: error.message });
  }
};

export const deletarVeiculo = async (req, res) => {
  const { id } = req.params;

  try {
    
    const veiculo = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!veiculo) {
      return res.status(404).json({ error: 'Veículo não encontrado' });
    }

    await prisma.vehicle.delete({
      where: { id },
    });

    console.log('Veículo excluído com sucesso!');
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir veículo', details: error.message });
  }
};
